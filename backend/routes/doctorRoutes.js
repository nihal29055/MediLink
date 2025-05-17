const express = require("express");
const { getDoctorProfile } = require("../controllers/doctorController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getDoctorProfile);

module.exports = router;