import forge from 'node-forge';
import { createClientAsync } from 'soap';
import cuitTokenModel from "../models/invoicer/CuitTokens";
import xml2js from 'xml2js';
import {dirname, resolve} from 'path'
import errors from 'common-errors'

import { fileURLToPath } from 'url';
import { creditTypes, invoiceTypes } from '../constants/AFIP';
import { convertDateToAAAAMMDD, parseStringResponse } from '../utils/dates';
import cuitModel from '../models/invoicer/Cuit';
import invoiceModel from '../models/invoicer/Invoice';
import BalanceService from './balanceService';

const __dirname = dirname(fileURLToPath(import.meta.url));

const xmlParser = new xml2js.Parser({
	normalizeTags: true,
	normalize: true,
	explicitArray: false,
	attrkey: 'header',
	tagNameProcessors: [key => key.replace('soapenv:', '')]
});

class AFIPService {
  constructor() {
  }
    async getCuitToken(id, organization) {
      const cuit = await cuitModel.findOne({_id: id, organization})
      if(!cuit){
        throw new errors.NotFoundError('Cuit no registrado en la empresa')
      }
      const cuitToken = await cuitTokenModel.findOne({cuit: cuit._id})
      if(cuitToken && new Date(cuitToken.expirationTime).getTime() > new Date().getTime()) {
        return cuitToken.toJSON()
      }
      const date = new Date();
      const expirationDate = new Date(date.getTime() + 600000)
      const tra = (`<?xml version="1.0" encoding="UTF-8" ?>
        <loginTicketRequest version="1.0">
          <header>
            <uniqueId>${Math.floor(date.getTime() / 1000)}</uniqueId>
            <generationTime>${new Date(date.getTime() - 600000).toISOString()}</generationTime>
            <expirationTime>${expirationDate.toISOString()}</expirationTime>
          </header>
          <service>wsfe</service>
        </loginTicketRequest>`).trim(); 

      const privateKey = cuit.privateKey
      const certificate = cuit.certificate
  
      const p7 = forge.pkcs7.createSignedData();
      p7.content = forge.util.createBuffer(tra, "utf8");
      p7.addCertificate(certificate);
      p7.addSigner({
        authenticatedAttributes: [{
          type: forge.pki.oids.contentType,
          value: forge.pki.oids.data,
        }, 
        {
          type: forge.pki.oids.messageDigest
        }, 
        {
          type: forge.pki.oids.signingTime, 
          value: new Date()
        }],
        certificate,
        digestAlgorithm: forge.pki.oids.sha256,
        key: privateKey,
      });
      p7.sign();
      const bytes = forge.asn1.toDer(p7.toAsn1()).getBytes();
      const signedTRA = Buffer.from(bytes, "binary").toString("base64");
      
      const soapClientOptions = { disableCache:true, endpoint: process.env.AFIP_LOGIN_ENDPOINT };
      const WSAA_WSDL = resolve(__dirname, 'wsaa.wsdl');

      const soapClient = await createClientAsync(WSAA_WSDL, soapClientOptions);

      const loginArguments = { in0: signedTRA };
      
      const [ loginCmsResult ] = await soapClient.loginCmsAsync(loginArguments)

      const response = await xmlParser.parseStringPromise(loginCmsResult.loginCmsReturn); 
      const parsedResponse = {
        ...response.loginticketresponse.credentials,
        expirationTime: expirationDate
      }
      await cuitTokenModel.create({...parsedResponse, cuit: cuit._id })
      return parsedResponse
    }

    async createAFIPInvoice(cuitId, organization, data) {
      try {
        const cuit = await cuitModel.findOne({organization, _id: cuitId})
        if(!cuit) {
          throw new errors.NotFoundError('Cuit no registrado para el usuario')
        }
        const authorization = await this.getCuitToken(cuitId, organization)
        data.number = parseInt(data.number)
        const invoice = await invoiceModel.create({...data, cuit: cuitId})
        const parsedData = {
          'CantReg' 		: 1,
          'PtoVta' 		: cuit.salePoint,
          'CbteTipo' 		: invoiceTypes[data.invoiceType], // Tipo de comprobante (ver tipos disponibles) 
          'Concepto' 		: 3,
          'DocTipo' 		: data.destinataryDocumentType, // Tipo de documento del comprador (ver tipos disponibles)
          'DocNro' 		: parseInt(data.destinataryDocument), // Numero de documento del comprador
          'CbteDesde' 	: data.number, // Numero de comprobante o numero del primer comprobante en caso de ser mas de uno
          'CbteHasta' 	: data.number, // Numero de comprobante o numero del ultimo comprobante en caso de ser mas de uno
          'CbteFch' 		: convertDateToAAAAMMDD(data.date), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
          'ImpTotal' 		: data.total, // Importe total del comprobante
          'ImpTotConc' 	: 0, // Importe neto no gravado
          'ImpNeto' 		: data.invoiceType === 'C' || data.invoiceType === 'NOTA_CREDITO_C' ? data.total : (data.total / 1.21).toFixed(2), // Importe neto gravado
          'ImpOpEx' 		: 0, // Importe exento de IVA
          'ImpIVA' 		: data.invoiceType === 'C' || data.invoiceType === 'NOTA_CREDITO_C' ? '0' : ((data.total / 1.21) *0.21).toFixed(2), //Importe total de IVA
          'ImpTrib' 		: 0, //Importe total de tributos
          'FchServDesde' 	: convertDateToAAAAMMDD(data.date), // (Opcional) Fecha de inicio del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
          'FchServHasta' 	: convertDateToAAAAMMDD(data.date), // (Opcional) Fecha de fin del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
          'FchVtoPago' 	: convertDateToAAAAMMDD(data.date), // (Opcional) Fecha de vencimiento del servicio (yyyymmdd), obligatorio para Concepto 2 y 3
          'MonId' 		: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
          'MonCotiz' 		: 1, // Cotización de la moneda usada (1 para pesos argentinos)  
          ...(data.invoiceType === 'C' || data.invoiceType === 'NOTA_CREDITO_C' ? {} :
          {
            'Iva': [ // (Opcional) Alícuotas asociadas al comprobante
              {
                'Id' 		: 5, // Id del tipo de IVA (ver tipos disponibles) 
                'BaseImp' 	: (data.total / 1.21).toFixed(2), // Base imponible
                'Importe' 	: ((data.total / 1.21) * 0.21).toFixed(2) // Importe 
              }
            ], 
          }),
        };
        if(creditTypes.includes(data.invoiceType)) {
          parsedData['CbtesAsoc'] = [ // (Opcional) Comprobantes asociados
            {
              'Tipo' 		: invoiceTypes[cuit.invoiceType], // Tipo de comprobante (ver tipos disponibles) 
              'PtoVta' 	: cuit.salePoint, // Punto de venta
              'Nro' 		: data.asociatedInvoice, // Numero de comprobante
            }
          ]
        }

        const req = {
          'FeCAEReq' : {
            'FeCabReq' : {
              'CantReg' 	: parsedData['CbteHasta'] - parsedData['CbteDesde'] + 1,
              'PtoVta' 	: parsedData['PtoVta'],
              'CbteTipo' 	: parsedData['CbteTipo']
            },
            'FeDetReq' : { 
              'FECAEDetRequest' : parsedData
            }
          }
        };
    
        delete parsedData['CantReg'];
        delete parsedData['PtoVta'];
        delete parsedData['CbteTipo'];
    
        if (parsedData['Tributos']) 
          parsedData['Tributos'] = { 'Tributo' : parsedData['Tributos'] };
    
        if (parsedData['Iva']) 
          parsedData['Iva'] = { 'AlicIva' : parsedData['Iva'] };
        
        if (parsedData['CbtesAsoc']) 
          parsedData['CbtesAsoc'] = { 'CbteAsoc' : parsedData['CbtesAsoc'] };
        
        if (parsedData['Compradores']) 
          parsedData['Compradores'] = { 'Comprador' : parsedData['Compradores'] };
    
        if (parsedData['Opcionales']) 
          parsedData['Opcionales'] = { 'Opcional' : parsedData['Opcionales'] };
        
        await this.connectClient()
    
        let [ result ] = await this.soapClient['FECAESolicitarAsync']({...req, Auth: {Sign: authorization.sign, Token: authorization.token, Cuit: cuit.cuit.replaceAll('-','')}});

        if(result.FECAESolicitarResult.FeCabResp.Resultado === 'R') {
          const errors = result.FECAESolicitarResult?.Errors?.Err?.map((err) => err.Msg) || []
          const observations= result.FECAESolicitarResult?.FeDetResp?.FECAEDetResponse[0]?.Observaciones?.Obs?.map((obs)=>  parseStringResponse(obs.Msg)) || []
          const errorReason = [...errors,...observations].length ? [...errors,...observations].join(',') : 'Unknown AFIP Error'
          await invoiceModel.updateOne({_id: invoice._id}, {status: 'REJECTED', reason: errorReason })
          throw new Error(errorReason)
        }
        await invoiceModel.updateOne({_id: invoice._id},{status: 'PROCESSED', cae: result.FECAESolicitarResult?.FeDetResp?.FECAEDetResponse[0]?.CAE})
        await BalanceService.create({date: data.date, amount: creditTypes.includes(data.invoiceType) ? -data.total : data.total, cuit: cuitId })
        return [invoice, cuit];
      } catch (err) {
        console.error(err.message)
        throw err
      }
    }
    
    async connectClient() {
      if(!this.soapClient) {
        let soapClientOptions = { 
          disableCache: true, 
          forceSoap12Headers: this.soapv12
        };
        let WSFE_WSDL;
        if (process.env.AFIP_ENVIRONMENT === 'testing') {
          WSFE_WSDL = resolve(__dirname,'wsdl_test', 'wsfe.wsdl');
        } else {
          WSFE_WSDL = resolve(__dirname,'wsdl_production', 'wsfe.wsdl');
        }
        this.soapClient = await createClientAsync(WSFE_WSDL, soapClientOptions);
        this.soapClient.setEndpoint(process.env.AFIP_SERVICE);
      }
    }

    async getNextInvoiceNumber(cuitId, organization, invoiceType) {
      const cuit = await cuitModel.findOne({_id: cuitId, organization})
      if(!cuit) {
        throw new errors.NotFoundError('Cuit no registrado para el usuario')
      }
      const authorization = await this.getCuitToken(cuitId, organization)
      const req = {
        'PtoVta' 	: cuit.salePoint,
        'CbteTipo' 	: invoiceTypes[invoiceType.toUpperCase()]
      };
      await this.connectClient()

      let [ result ] = await this.soapClient['FECompUltimoAutorizadoAsync']({...req, Auth: {Sign: authorization.sign, Token: authorization.token, Cuit: cuit.cuit.replaceAll('-','')}});
      return +result.FECompUltimoAutorizadoResult?.CbteNro + 1;
    }
}

export default AFIPService