import User from '../models/User';
import Organization from '../models/Organization';
import bcrypt from 'bcryptjs';
import Util from '../utils/auth';
import PaymentService from '../services/paymentService/paymentService';

const util = new Util()
const paymentService = new PaymentService()
class UserController {
    static async loginUser (req, res) {
        try {
          const user = await User.findOne({
            email: req.body.email.toLowerCase(),
          });
      
          if (!user) throw new Error('Email is not registered');
      
          if (!bcrypt.compareSync(req.body.password, user.password))
            throw new Error('Check your credentials');
          
          const organizationStatus = await paymentService.getSuscriptionData(user.organization)
          res.send({user: {...user.toJSON(), id: user._id}, token: util.generateJwtToken({ id: user._id }), ...organizationStatus});
        } catch (error) {
          console.log(error.message)
          res.status(401).json({ message: error.message });
        }
      }

    static async registerUser (req, res) {
        try {
            const {
                organization,
                name,
                email,
                password,
            } = req.body
            const existentUser = await User.findOne({email: email.toLowerCase()})
            if(existentUser) throw new Error('User already registered in an Organization')
            const newOrg = new Organization({name: organization, maxCuits: 5, freeAccount: false});
            await newOrg.save();
            const user = new User({name, email: email.toLowerCase(), role: 'admin', organization: newOrg._id});
            user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            await user.save();
            res.send('User Registered Successfully');
        } catch (error) {
            res.status(500).json(error);
        }
    }
    static async getUserData(req, res) {
      try {
        let tokenData = await util.decodeJwt(req.header('Authorization'))
        const user = await User.findOne({_id: tokenData.user.id})
        if(!user) {
          return res.status(401).json({message: 'User does not exist'})
        }
        const organizationStatus = await paymentService.getSuscriptionData(user.organization)
        res.send({user: {...user.toJSON(), id: user._id}, token: util.generateJwtToken({ id: user._id }), ...organizationStatus});
      } catch (err) {
        res.status(500).json({message: err.message})
      }
    }
}

export default UserController