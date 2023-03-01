const Organization = require('../models/Organization');
const Account = require('../models/Account');

class AccountsController {
    static async createAccount (req, res) {
        try {
          const {id} = req.params
          const organization = await Organization.findById(id)
          if(!organization) {
              res.status(404).json("Organization does not exist");
          }
          const {
            name,
            type
          } = req.body
          const existentAccount = await Account.find({name,type,organization: id})
          if(existentAccount.length) throw new Error('Account already exists in organization')
          const account = new Account({name, type, organization: id});
          await account.save();
          res.send('Organization Account successfully added');
        } catch (error) {
          console.log(error.message)
          res.status(500).json(error.message);
        }
      }
    static async getAccounts (req, res) {
        try {
          const {id} = req.params
          const organization = await Organization.findById(id)
          if(!organization) {
            res.status(404).json("Organization does not exist");
          }
          const accounts = await Account.find({organization: id})
          res.send(accounts);
        } catch (error) {
          console.log(error)
          res.status(500).json(error);
        }
      }
}

module.exports = AccountsController