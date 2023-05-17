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
                registerType,
                salePoint,
                certificate,
                privateKey,
                staticVat,
                vat,
            } = req.body;
            const cuits = await CuitService.count(res.locals.user.organization)
            if(cuits + 1 > res.locals.user.maxCuits ) {
                return res.status(400).json({message:'Se ha alcanzado el numero maximo de cuits del plan'})
            }
            await CuitService.create({
                cuit,
                address,
                fullname,
                organization: res.locals.user.organization,
                initAct,
                registerType,
                salePoint,
                certificate,
                privateKey,
                staticVat,
                vat,
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
    static async removeCuit(req,res) {
        try {
            const {id} = req.params
            await CuitService.delete(res.locals.user.organization, id)
            return res.status(204).json({message: 'Cuit successfully removed'})
        } catch (err) {
            console.log(err)
            if(err instanceof errors.NotFoundError) {
                return res.status(404).json({message: err.message })
            }
            return res.status(500).json({message: 'Could not remove cuit from user'})
        }
    }
}

export default CuitController