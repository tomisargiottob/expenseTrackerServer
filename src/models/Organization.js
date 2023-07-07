import mongoose from 'mongoose'

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  suscriptionId: {
    type: String,
    required: false,
  },
  maxCuits: {
    type: Number,
    required: true,
  },
  freeAccount: {
    type: Boolean,
    required: true,
  }
}, {
  timestamps: true
});

const organizationModel = mongoose.model("Organizations", organizationSchema);

export default organizationModel;
