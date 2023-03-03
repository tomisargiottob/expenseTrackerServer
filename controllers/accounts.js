const Organization = require('../models/Organization');
const Account = require('../models/Account');

class AccountsController {
    static async createAccount (req, res) {
        try {
          const {organizationId} = req.params
          const organization = await Organization.findById(organizationId)
          if(!organization) {
            return res.status(404).json("Organization does not exist");
          }
          const {
            name,
            type
          } = req.body
          const existentAccount = await Account.find({name,type,organization: organizationId})
          if(existentAccount.length) throw new Error('Account already exists in organization')
          const account = new Account({name, type, organization: organizationId});
          await account.save();
          res.send('Organization Account successfully added');
        } catch (error) {
          console.log(error.message)
          res.status(500).json(error.message);
        }
      }
    static async getAccounts (req, res) {
      try {
        const {organizationId} = req.params
        const organization = await Organization.findById(organizationId)
        if(!organization) {
          return res.status(404).json("Organization does not exist");
        }
        const accounts = await Account.find({organization: organizationId})
        res.send(accounts);
      } catch (error) {
        console.log(error)
        res.status(500).json(error);
      }
    }
    static async removeAccount (req, res) {
      try {
        const {organizationId, id} = req.params
        const organization = await Organization.findById(organizationId)
        if(!organization) {
          return res.status(404).json("Organization does not exist");
        }
        const account = await Account.find({organization: organizationId, _id:id})
        if(!account) {
          return res.status(404).json("Account does not exist");
        }
        await Account.deleteOne({organization: organizationId, _id:id})
        res.status(204).send();
      } catch (error) {
        console.log(error)
        res.status(500).json(error);
      }
    }
}

module.exports = AccountsController