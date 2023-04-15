import Organization from '../models/Organization';
import Account from '../models/Account';
import Transaction from '../models/Transaction';

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
        } = req.body
        const existentAccount = await Account.find({name,organization: organizationId})
        if(existentAccount.length) throw new Error('Account already exists in organization')
        const account = new Account({name, organization: organizationId});
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
    static async removeAccount(req, res) {
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
        const transactions = await Transaction.count({account: id})
        if(transactions) {
          return res.status(400).json(`Can not delete an account that has ${transactions} transactions created`)
        }
        await Account.deleteOne({organization: organizationId, _id:id})
        res.status(204).send();
      } catch (error) {
        console.log(error)
        res.status(500).json(error);
      }
    }
    static async updateAccount (req, res) {
      try {
        await Account.findOneAndUpdate({_id : req.params.id, organization: req.params.organizationId} , req.body)
        res.send("Account Updated Successfully");
      } catch (error) {
        res.status(500).json(error);
      }
    }
}

export default AccountsController