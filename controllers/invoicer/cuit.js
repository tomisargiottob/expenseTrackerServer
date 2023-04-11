import CuitService from '../../services/cuitService';
import errors from 'common-errors'

class CuitController {
    static async addCuit(req, res) {
        try {
            const {
                cuit,
                address,
                fullname,
                initAct,
                invoiceType,
                salePoint,
                certificate,
                privateKey
            } = req.body;
            await CuitService.create(res.locals.user.organization, {
                cuit,
                address,
                fullname,
                initAct,
                invoiceType,
                salePoint,
                certificate,
                privateKey
            })
            return res.status(200).json({message: 'Cuit successfully added'})
        } catch (err) {
            console.log(err)
            if(err instanceof errors.AlreadyInUseError) {
                return res.status(400).json({message: err.message})
            }
            return res.status(500).json({message: 'Could not add cuit to user'})
        }
    }
    static async getAllCuits(req, res) {
        try {
            const cuits = await CuitService.all({organization: res.locals.user.organization})
            return res.status(200).json(cuits)
        } catch (err) {
            console.log(err)
            return res.status(500).json({message: 'Could not find user cuits'})
        }
    }
    static async getCuit(req,res) {
        try {
            const {id} = req.params
            const cuit = await CuitService.one(res.locals.user.organization, id)
            return res.status(200).json(cuit)
        } catch (err) {
            console.log(err)
            if(err instanceof errors.NotFoundError) {
                return res.status(404).json({message: err.message })
            }
            return res.status(500).json({message: 'Could not search cuit to user'})
        }
    }
}

export default CuitController