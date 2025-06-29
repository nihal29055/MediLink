const express = require("express");
const { createReport, getReports, getAllLabReports, getLabReportById, createLabReport, updateLabReport, deleteLabReport } = require("../controllers/reportController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Existing routes for general reports
router.post("/", protect, createReport);
router.get("/", protect, getReports);

// Routes for Lab Report Management
router.get("/lab", protect, getAllLabReports);
router.get("/lab/:id", protect, getLabReportById);
router.post("/lab", protect, createLabReport);
router.put("/lab/:id", protect, updateLabReport);
router.delete("/lab/:id", protect, deleteLabReport);

module.exports = router;