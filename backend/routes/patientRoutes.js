const express = require("express");
const { createPatient, getPatient, updatePatient, deletePatient } = require("../controllers/patientController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect routes with authentication middleware
router.use(protect);

// Patient routes
router.post("/", createPatient);
router.get("/:id", getPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

module.exports = router;