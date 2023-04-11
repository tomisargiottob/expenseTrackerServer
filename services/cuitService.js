import Cuit from '../models/invoicer/Cuit';
import errors from 'common-errors'

class CuitService {
    static async one(organization, _id) {
        const cuit = await Cuit.findOne({organization, _id}).select({certificate: 0, privateKey: 0})
        if(!cuit) {
            throw new errors.NotFoundError('Cuit no registrado para el usuario')
        }
        return {...cuit.toJSON(), id: cuit._id}
    }
    static async all(where) {
        const cuits = await Cuit.find(where).select({certificate: 0, privateKey: 0})
        const parsedCuits = cuits.map((cuit) => {
            return {...cuit.toJSON(), id: cuit._id}
        })
        return parsedCuits
    }
    static async create(organizationid, cuitId, cuitData) {
        const existentCuit = await Cuit.find({organization: organizationid, cuit: cuitId})
        if(existentCuit.length) {
            throw new errors.AlreadyInUseError('Cuit already exists')
        }
        await Cuit.create(cuitData)
    }
}

export default CuitService