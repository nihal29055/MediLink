const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  medicalHistory: { type: String },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  bed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed', required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);