import mongoose from 'mongoose'

const accountTypeSchema = new mongoose.Schema({
  organization : { type: String, required: true, ref: 'Organizations'},
  name: { type: String, required: true },
});

const accountModel = mongoose.model("AccountTypes", accountTypeSchema);

export default accountModel;
