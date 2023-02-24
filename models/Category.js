const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  organization : { type: String, required: true, ref: 'Organization'},
  name: { type: String, required: true },
});

const categoryModel = mongoose.model("Categories", categorySchema);

module.exports = categoryModel;
