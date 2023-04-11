import invoiceModel from "../models/invoicer/Invoice";
import errors from 'common-errors'

class InvoiceService {
    static async all(id,skip=0,limit=10, filter) {
        let where
        if(filter) {
            const regexFilter = new RegExp(filter, 'i')
            where = {}
            where['$and'] = [
                {['$or']: [
                    { ...(+filter ? {number: filter} : {})},
                    {destinatary: regexFilter},
                    {destinataryDocument: regexFilter}
                ]},
                {cuit: id},
            ]
        }
        const count = await invoiceModel.count(where ? where : {cuit: id})
        const invoices = await invoiceModel.find(where ? where : {cuit: id}).sort({createdAt: -1}).skip(skip).limit(limit)
        return { invoices: invoices.map((invoice)=> invoice.toJSON()), count }
    }
    static async one(id, cuitId) {
        const invoice = await invoiceModel.findOne({_id:id, cuit: cuitId})
        if(!invoice) {
            throw new errors.NotFoundError('Invoice not found')
        }
        return invoice.toJSON()
    }
}

export default InvoiceService