const express = require("express");
const { createPatient, getPatient, updatePatient, deletePatient, createOpdIpdRecord, getOpdIpdRecord, updateOpdIpdRecord, deleteOpdIpdRecord, createAppointment, getAppointment, updateAppointment, deleteAppointment } = require("../controllers/patientController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect routes with authentication middleware
router.use(protect);

// Patient routes
router.post("/", createPatient);
router.get("/:id", getPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

// OPD/IPD routes
router.post("/opdipd", createOpdIpdRecord);
router.get("/opdipd/:id", getOpdIpdRecord);
router.put("/opdipd/:id", updateOpdIpdRecord);
router.delete("/opdipd/:id", deleteOpdIpdRecord);

// Appointment routes
router.post("/appointments", createAppointment);
router.get("/appointments/:id", getAppointment);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);

module.exports = router;