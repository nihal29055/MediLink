const mongoose = require('mongoose');

const opdIpdRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  visitType: {
    type: String,
    required: true,
    enum: ['OPD', 'IPD']
  },
  visitDate: {
    type: Date,
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming doctors are users in the User model
    required: true
  },
  diagnosis: {
    type: String
  },
  treatmentPlan: {
    type: String
  },
  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed', // Assuming a Bed model exists for bed allocation
    required: function() { return this.visitType === 'IPD'; } // Required only for IPD
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now } // Added updatedAt field
});

module.exports = mongoose.model('OpdIpdRecord', opdIpdRecordSchema);
const mongoose = require('mongoose');

const opdIpdRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['OPD', 'IPD']
  },
  admissionDate: {
    type: Date,
    required: true
  },
  dischargeDate: {
    type: Date,
    required: function() { return this.type === 'IPD'; } // Required only for IPD
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming doctors are users in the User model
    required: true
  },
  wardRoomNumber: {
    type: String,
    required: function() { return this.type === 'IPD'; } // Required only for IPD
  },
  summary: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OpdIpdRecord', opdIpdRecordSchema);