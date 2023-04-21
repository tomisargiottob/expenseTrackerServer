import User from '../models/User';
import Organization from '../models/Organization';
import bcrypt from 'bcryptjs';
import Util from '../utils/auth';

const util = new Util()
class UserController {
    static async loginUser (req, res) {
        try {
          const user = await User.findOne({
            email: req.body.email.toLowerCase(),
          });
      
          if (!user) throw new Error('Email is not registered');
      
          if (!bcrypt.compareSync(req.body.password, user.password))
            throw new Error('Check your credentials');
          res.send({user: {...user.toJSON(), id: user._id}, token: util.generateJwtToken({ id: user._id })});
        } catch (error) {
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
            const newOrg = new Organization({name: organization});
            await newOrg.save();
            const user = new User({name, email: email.toLowerCase(), role: 'admin', organization: newOrg._id, maxCuits: 5});
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
        res.send({user: {...user.toJSON(), id: user._id}, token: util.generateJwtToken({ id: user._id })});
      } catch (err) {
        res.status(500).json(err)
      }
    }
}

export default UserController