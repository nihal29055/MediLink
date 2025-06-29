const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "doctor"], default: "user" },
  employeeId: { type: String, unique: true, sparse: true }, // sparse allows null values to not violate the unique constraint
  designation: { type: String },
  department: { type: String },
  contact: {
    phone: { type: String },
    address: { type: String },
  },
  hireDate: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);