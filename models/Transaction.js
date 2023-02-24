const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  organization : { type: String, required: true, ref: 'Organization'},
  account: { type: String, required: true, ref: 'Account' },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  category: { type: String, required: true, ref: 'Category' },
  reference: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
});

const transactionModel = mongoose.model("Trasactions", transactionSchema);

module.exports = transactionModel;
