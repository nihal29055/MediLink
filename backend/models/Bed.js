const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bedSchema = new Schema({
  bedNumber: {
    type: String,
    required: true,
    unique: true
  },
  ward: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    required: true,
    enum: ['ICU', 'General', 'Private'] // Example enum for room types
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: false // Optional, only present if the bed is occupied
  }
});

module.exports = mongoose.model('Bed', bedSchema);