import mongoose from 'mongoose'

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const organizationModel = mongoose.model("Organizations", organizationSchema);

export default organizationModel;
