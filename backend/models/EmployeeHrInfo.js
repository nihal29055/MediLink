const mongoose = require('mongoose');

const employeeHrInfoSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  gaji: {
    type: Number,
    required: true,
  },
  bankAccount: {
    type: String,
  },
  taxInformation: {
    type: String,
  },
  hireDate: {
    type: Date,
  },
  jobTitle: {
    type: String,
  },
  department: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('EmployeeHrInfo', employeeHrInfoSchema);