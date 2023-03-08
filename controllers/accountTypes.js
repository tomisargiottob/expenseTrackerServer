const Organization = require('../models/Organization');
const AccountType = require('../models/AccountType');
const Transaction = require('../models/Transaction');


class AccountTypesController {
    static async createAccountType (req, res) {
      try {
        const {organizationId} = req.params
        const organization = await Organization.findById(organizationId)
        if(!organization) {
          return res.status(404).json("Organization does not exist");
        }
        const {
          name,
        } = req.body
        const existentAccount = await AccountType.find({name,organization: organizationId})
        if(existentAccount.length) throw new Error('Account already exists in organization')
        const account = new AccountType({name, organization: organizationId});
        await account.save();
        res.send('Organization Account type successfully added');
      } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message);
      }
    }
    static async getAccountTypes (req, res) {
      try {
        const {organizationId} = req.params
        const organization = await Organization.findById(organizationId)
        if(!organization) {
          return res.status(404).json("Organization does not exist");
        }
        const accountTypes = await AccountType.find({organization: organizationId})
        res.send(accountTypes);
      } catch (error) {
        console.log(error)
        res.status(500).json(error);
      }
    }
    static async removeAccountType(req, res) {
      try {
        const {organizationId, id} = req.params
        const organization = await Organization.findById(organizationId)
        if(!organization) {
          return res.status(404).json("Organization does not exist");
        }
        const accountType = await AccountType.find({organization: organizationId, _id:id})
        if(!accountType) {
          return res.status(404).json("Account type does not exist");
        }
        const transactions = await Transaction.count({account: id})
        if(transactions) {
          return res.status(400).json(`Can not delete an account that has ${transactions} transactions created`)
        }
        await AccountType.deleteOne({organization: organizationId, _id:id})
        res.status(204).send();
      } catch (error) {
        console.log(error)
        res.status(500).json(error);
      }
    }
    static async updateAccountType (req, res) {
      try {
        await AccountType.findOneAndUpdate({_id : req.params.id, organization: req.params.organizationId} , req.body)
        res.send("Account type Updated Successfully");
      } catch (error) {
        res.status(500).json(error);
      }
    }
}

module.exports = AccountTypesController