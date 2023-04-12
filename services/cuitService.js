import Cuit from '../models/invoicer/Cuit';
import errors from 'common-errors'
import Invoice from "../models/invoicer/Invoice";
import Balance from '../models/invoicer/Balance';
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
    static async create(cuitData) {
        const existentCuit = await Cuit.find({organization: cuitData.organization, cuit: cuitData.cuit})
        if(existentCuit.length) {
            throw new errors.AlreadyInUseError('Cuit already exists')
        }
        await Cuit.create(cuitData)
    }
    static async count(organizationid) {
        const existentCuits = await Cuit.count({organization: organizationid})
        return existentCuits
    }
    static async delete(organizationid, id) {
        const cuit = await Cuit.count({organization: organizationid, _id: id})
        if(!cuit) {
            throw new errors.NotFoundError('Cuit no registrado para el usuario')
        }
        await Invoice.deleteMany({cuit: id})
        await Balance.deleteMany({cuit: id})
        await Cuit.findOneAndRemove({organization: organizationid, _id: id})
    }
}

export default CuitService