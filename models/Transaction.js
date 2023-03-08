const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  organization : { type: String, required: true, ref: 'Organizations'},
  account: { type: String, required: true, ref: 'Accounts' },
  accountType: { type: String, required: true, ref: 'AccountTypes' },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true, ref: 'Categories' },
  reference: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
});

const transactionModel = mongoose.model("Trasactions", transactionSchema);

module.exports = transactionModel;
