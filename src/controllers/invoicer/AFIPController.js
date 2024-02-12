import { invoiceTypes } from '../../constants/AFIP';
import AFIPService from '../../services/AFIPService';
import errors from 'common-errors'

const afipService = new AFIPService()
class AFIPController{

  static async getCMSToken(req, res) {
    try{
      const {id, organizationId} = req.params;
      const token = await afipService.getCuitToken(id, organizationId)
      res.status(200).json(token)
    } catch (err) {
      if(err instanceof errors.NotFoundError) {
        return res.status(404).json({message: err.message })
      }
      res.status(500).json({message: err.message})
    }
  }

  static async getNextInvoiceNumber(req,res) {
    try {
      const {id, organizationId} = req.params;
      const {invoiceType} = req.query;
      if(!invoiceType || !invoiceTypes[invoiceType.toUpperCase()]) {
        throw new errors.ValidationError('Please indicate a valid Invoice type')
      }
      const nextInvoiceNumber = await afipService.getNextInvoiceNumber(id, organizationId, invoiceType)
      res.status(200).json({nextInvoiceNumber})
    } catch (err) {
      if(err instanceof errors.ValidationError) {
        return res.status(400).json({message: err.message })
      }
      if(err instanceof errors.NotFoundError) {
        return res.status(404).json({message: err.message })
      }
      res.status(500).json({message: err.message})
    }
}
}

export default AFIPController
