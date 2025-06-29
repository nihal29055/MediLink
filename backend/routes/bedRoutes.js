const express = require("express");
const {
  createBed,
  getBeds,
  getBed,
  updateBed,
  deleteBed,
} = require("../controllers/bedController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect all routes with authentication middleware
router.use(protect);

// Bed routes
router.route("/").post(createBed).get(getBeds);
router.route("/:id").get(getBed).put(updateBed).delete(deleteBed);

module.exports = router;