const bcrypt = require('bcryptjs')

const Organization = require('../models/Organization');
const User = require('../models/Organization');

class OrganizationController {
    static async addUser (req, res) {
        try {
          const {id} = req.params
          const organization = await Organization.findByPk(id)
          if(!organization) {
              res.status(404).json("Organization does not exist");
          }
          const {
              name,
              email,
              password,
              role,
          } = req.body
          const user = new User({name, email, role});
          user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
          await user.save();
          res.send('Organization user successfully added');
        } catch (error) {
          res.status(500).json(error);
        }
      }
}

module.exports = OrganizationController