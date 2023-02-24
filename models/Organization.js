const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const organizationModel = mongoose.model("Organizations", organizationSchema);

module.exports = organizationModel;
