const express = require("express");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const doctorRoutes = require("./routes/doctorRoutes.js");
const patientRoutes = require("./routes/patientRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");
const nlpRoutes = require("./controllers/nlpRoutes.js");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/nlp", nlpRoutes);

module.exports = app;