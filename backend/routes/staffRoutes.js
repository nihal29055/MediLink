const express = require('express');
const {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getAllShifts,
  createShift,
  updateShift,
  deleteShift,
  getAllShiftAssignments,
  getShiftAssignmentById,
  createShiftAssignment,
  updateShiftAssignment,
  deleteShiftAssignment,
  getAllEmployeeHrInfo,
  getEmployeeHrInfoById,
  createEmployeeHrInfo,
  updateEmployeeHrInfo,
  deleteEmployeeHrInfo,
  getAllLeaveAttendance,
  getLeaveAttendanceById,
  createLeaveAttendance,
  updateLeaveAttendance,
  deleteLeaveAttendance,
} = require('../controllers/staffController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all staff routes
router.use(protect);

// Staff routes
router.route('/')
  .get(getAllStaff)
  .post(createStaff);

router.route('/:id')
  .get(getStaffById)
  .put(updateStaff)
  .delete(deleteStaff);

// Shift routes
router.route('/shifts')
  .get(getAllShifts)
  .post(createShift);

router.route('/shifts/:id')
  .put(updateShift)
  .delete(deleteShift);

// Shift Assignment routes
router.route('/shiftassignments')
  .get(getAllShiftAssignments)
  .post(createShiftAssignment);

router.route('/shiftassignments/:id')
  .get(getShiftAssignmentById)
  .put(updateShiftAssignment)
  .delete(deleteShiftAssignment);

// Employee HR Info routes
router.route('/hrinfo')
  .get(getAllEmployeeHrInfo)
  .post(createEmployeeHrInfo);

router.route('/hrinfo/:id')
  .get(getEmployeeHrInfoById)
  .put(updateEmployeeHrInfo)
  .delete(deleteEmployeeHrInfo);

// Leave and Attendance routes
router.route('/leaveattendance')
  .get(getAllLeaveAttendance)
  .post(createLeaveAttendance);

router.route('/leaveattendance/:id')
  .get(getLeaveAttendanceById)
  .put(updateLeaveAttendance)
  .delete(deleteLeaveAttendance);
module.exports = router;