import nodemailer from 'nodemailer'
import pdf from 'pdf-creator-node'
import fs from 'fs'
import { invoiceTypes } from '../constants/AFIP';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

class MailService{
    constructor() {
        this.mail = process.env.MAIL_USER
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: this.mail,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }

    async createInvoicePDF(invoice, cuit) {
        const filePath = resolve(__dirname, './mailTemplate/invoice.html');
        const html = fs.readFileSync(filePath, "utf8"); 
        const perfact = new Date(
            invoice.date.getFullYear(),
            invoice.date.getMonth(),
            invoice.date.getDate() + 1
          );
          const perdesDate = new Date(
            invoice.date.getFullYear(),
            invoice.date.getMonth(),
            1
          );
          const perhasDate = new Date(
            invoice.date.getFullYear(),
            invoice.date.getMonth() + 1,
            -1
          );
        const document = {
            html: html,
            data: {
                cod: invoice.invoiceType,
                invoiceCode: invoiceTypes[invoice.invoiceType],
                invoiceType:
                  invoice.invoiceType === 'A' ||
                  invoice.invoiceType === 'B' ||
                  invoice.invoiceType === 'C'
                    ? 'FACTURA'
                    : 'NOTA CREDITO',
                fullname: cuit.fullname,
                address: cuit.address,
                initAct: new Date(cuit.initAct).toLocaleDateString(),
                salePoint: cuit.salePoint,
                number: invoice.number.toString().padStart(8, '0'),
                date: perfact.toLocaleDateString(),
                cuit: cuit.cuit,
                perdes: perdesDate.toLocaleDateString(),
                perhas: perhasDate.toLocaleDateString(),
                destinataryDocument: invoice.destinataryDocument,
                destinatary: invoice.destinatary,
                description: invoice.description,
                units: invoice.units,
                unitValue: invoice.unitValue,
                total: invoice.total,
                cae: invoice.cae,
            },
            type: "buffer",
        };
        let bufferResponse
        try {
            bufferResponse = await pdf.create(document, {
                format: 'A4',
                orientation: 'portrait',
                border: '5mm',
                timeout: 60000,
            });
            console.log(bufferResponse)
        } catch (err) {
            console.log(err.message)
        }
        this.sendMail(bufferResponse, invoice,cuit)
    }

    sendMail(fileName, invoice, cuit) {
        let mailOptions = {
            from: this.mail,
            to: invoice.mailTo,
            subject: `Factura de ${cuit.fullname}`,
            text: `Se envia adjunta la factura emitida el día ${invoice.date} emitida a ${invoice.destinatary}`,
            attachments: [
                {
                    filename: 'Factura.pdf',
                    content: fileName,
                    encoding: 'base64'
                }
            ]
        };
        
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Correo electrónico enviado: ' + info.response);
            }
        });
    }
}

export default MailService