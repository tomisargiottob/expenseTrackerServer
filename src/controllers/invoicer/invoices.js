import AFIPService from "../../services/AFIPService";
import errors from 'common-errors'
import InvoiceService from "../../services/invoiceService"
import CuitService from "../../services/cuitService";
import MailService from "../../services/mailingService";

const afipService = new AFIPService()
const mailService = new MailService()

class InvoiceController{

    static async createInvoice(req, res) {
        try {
            const {invoiceData} = req.body;
            const {id} = req.params
            const [invoice, cuit] =await afipService.createAFIPInvoice(id, res.locals.user.organization , invoiceData)
            if(invoiceData.mailTo) {
                await mailService.createInvoicePDF(invoice, cuit)
            }
            res.status(200).json({message: 'Factura creada con exito'})
        } catch (err) {
            if(err instanceof errors.NotFoundError) {
                return res.status(404).json({message: err.message })
            }
            res.status(400).json({message: err.message, reason: err.message})
        }
    }
    static async createBatchInvoice(req, res) {
        try {
            const {invoicesData} = req.body;
            const {id} = req.params
            for(const invoice of invoicesData) {
                await afipService.createAFIPInvoice(id, res.locals.user.organization , invoice)
            }
            res.status(200).json({message: 'Factura creada con exito'})
        } catch (err) {
            if(err instanceof errors.NotFoundError) {
                return res.status(404).json({message: err.message })
            }
            res.status(500).json({message: 'No se han podido registrar las facturas'})
        }
    }
    static async getInvoices(req, res) {
        try {
            const {id} = req.params
            const {skip, limit, filter} = req.query
            const cuit = await CuitService.one(res.locals.user.organization, id)
            if(!cuit){
               throw new errors.NotFoundError('Cuit no registrado en la organizacion')
            }
            const invoiceData = await InvoiceService.all(cuit._id, skip, limit, filter)
            res.status(200).json(invoiceData)
        } catch (err) {
            console.log(err)
            if(err instanceof errors.NotFoundError) {
                return res.status(404).json({message: err.message })
            }
            res.status(500).json({message: 'No se han podido recuperar las facturas'})
        }
    }
}

export default InvoiceController