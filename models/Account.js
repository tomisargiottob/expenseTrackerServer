const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  organization : { type: String, required: true, ref: 'Organizations'},
  name: { type: String, required: true },
});

const accountModel = mongoose.model("Accounts", accountSchema);

module.exports = accountModel;
