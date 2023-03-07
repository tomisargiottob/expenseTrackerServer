const Transaction = require("../models/Transaction");
const { subDays } = require('date-fns');



class TransactionController {
  static async getTransactions (req, res) {
    const { frequency, selectedRange , type } = req.query;
    try {
      const transactions = await Transaction.find({
        ...(frequency !== "custom"
          ? {
              date: {
                $gt: subDays(new Date(), Number(frequency))
              },
            }
          : {
              date: {
                $gte: selectedRange[0],
                $lte: selectedRange[1],
              },
            }),
        organization: req.params.organizationId,
        ...(type!=='all' && {type})
      }).populate(['account','category']);

      res.send(transactions);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  static async removeTransaction (req, res) {
    try {
      await Transaction.findOneAndDelete({_id : req.params.id, organization: req.params.organizationId})
      res.send("Transaction Successfully Removed");
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async updateTransaction (req, res) {
    try {
      await Transaction.findOneAndUpdate({_id : req.params.id, organization: req.params.organizationId} , req.body)
      res.send("Transaction Updated Successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async createTransaction (req, res) {
    try {
      const newtransaction = new Transaction(req.body);
      await newtransaction.save();
      res.send("Transaction Added Successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = TransactionController