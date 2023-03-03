const User = require('../models/User');
const Organization = require('../models/Organization');
const bcrypt = require('bcryptjs');

class UserController {
    static async loginUser (req, res) {
        try {
          const user = await User.findOne({
            email: req.body.email,
          });
      
          if (!user) throw new Error('Email is not registered');
      
          if (!bcrypt.compareSync(req.body.password, user.password))
            throw new Error('Check your credentials');
          const organization = await Organization.findOne({_id: user.organization})
          res.send({user, organization});
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
            const existentUser = await User.findOne({email})
            if(existentUser) throw new Error('User already registered in an Organization')
            const newOrg = new Organization({name: organization});
            await newOrg.save();
            const user = new User({name, email, role: 'admin', organization: newOrg._id});
            user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            await user.save();
            res.send('User Registered Successfully');
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = UserController