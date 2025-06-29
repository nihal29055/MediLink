const mongoose = require('mongoose');

const leaveAttendanceSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave'],
    required: true,
  },
  leaveType: {
    type: String,
    required: function() {
      return this.status === 'leave';
    },
  },
  reason: {
    type: String,
    required: function() {
      return this.status === 'absent' || this.status === 'leave';
    },
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

module.exports = mongoose.model('LeaveAttendance', leaveAttendanceSchema);