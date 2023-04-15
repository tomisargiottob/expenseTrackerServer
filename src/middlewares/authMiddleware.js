import Util from "../utils/auth"
import User from '../models/User'

const util = new Util()

const getUser = async (req, res, next) => {
    try {
      let tokenData = await util.decodeJwt(req.header('Authorization'))
      res.locals.user = await User.findOne({_id: tokenData.user.id})
      if(!res.locals.user) {
        return res.status(401).json({message: 'User does not exist'})
      }
      if(req.params.organizationId && req.params.organizationId !== res.locals.user.organization) {
        return res.status(401).json({message: 'User does not belong to the given organization'})
      }
      next()
    } catch (e) {
      if(e === 'JWT_ERROR') {
        return res.status(401).json({message: 'Invalid token'})
      }
      return res.status(500).json({message: e.message})
    }
}

export default getUser