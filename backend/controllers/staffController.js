const User = require("../models/User");
const Shift = require("../models/Shift");
const ShiftAssignment = require("../models/ShiftAssignment");
const bcrypt = require("bcrypt");
const EmployeeHrInfo = require("../models/EmployeeHrInfo");
const LeaveAttendance = require("../models/LeaveAttendance");

// Get all staff members (users with role 'doctor' or 'user')
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ["doctor", "user"] } }).select('-password'); // Exclude password
    res.status(200).json(staff);
  } catch (error) {
    console.error("Error fetching all staff:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Employee HR Info Management ---

// Get all employee HR info records
exports.getAllEmployeeHrInfo = async (req, res) => {
  try {
    const hrInfo = await EmployeeHrInfo.find().populate('staff', '-password'); // Populate staff details
    res.status(200).json(hrInfo);
  } catch (error) {
    console.error("Error fetching all employee HR info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single employee HR info record by ID
exports.getEmployeeHrInfoById = async (req, res) => {
  const { id } = req.params;

  try {
    const hrInfo = await EmployeeHrInfo.findById(id).populate('staff', '-password'); // Populate staff details
    if (!hrInfo) {
      return res.status(404).json({ message: "Employee HR info not found" });
    }
    res.status(200).json(hrInfo);
  } catch (error) {
    console.error("Error fetching employee HR info by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new employee HR info record
exports.createEmployeeHrInfo = async (req, res) => {
  const { staff, salary, bankAccount, taxInformation, hireDate, jobTitle, department } = req.body;

  // Validation
  if (!staff || !salary) {
    return res.status(400).json({ message: "Missing required fields: staff, salary" });
  }

  try {
    // Check if staff exists and is a valid user
    const existingStaff = await User.findById(staff);
    if (!existingStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    // Check if HR info already exists for this staff member
    const existingHrInfo = await EmployeeHrInfo.findOne({ staff });
    if (existingHrInfo) {
      return res.status(409).json({ message: "HR information already exists for this staff member" });
    }

    const newHrInfo = new EmployeeHrInfo({
      staff,
      salary,
      bankAccount,
      taxInformation,
      hireDate,
      jobTitle,
      department,
    });

    await newHrInfo.save();
    res.status(201).json(newHrInfo);
  } catch (error) {
    console.error("Error creating employee HR info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing employee HR info record by ID
exports.updateEmployeeHrInfo = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const hrInfo = await EmployeeHrInfo.findByIdAndUpdate(id, updates, { new: true }).populate('staff', '-password'); // Populate staff details
    if (!hrInfo) {
      return res.status(404).json({ message: "Employee HR info not found" });
    }
    res.status(200).json(hrInfo);
  } catch (error) {
    console.error("Error updating employee HR info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete an employee HR info record by ID
exports.deleteEmployeeHrInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const hrInfo = await EmployeeHrInfo.findByIdAndDelete(id);
    if (!hrInfo) {
      return res.status(404).json({ message: "Employee HR info not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting employee HR info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Leave and Attendance Management ---

// Implement remaining Leave and Attendance controller functions (getAll, getById, create, update, delete) in subsequent steps
// For now, these are placeholders to match the routes defined in staffRoutes.js
exports.getAllLeaveAttendance = async (req, res) => { res.status(501).json({ message: "Not Implemented: getAllLeaveAttendance" }); };
exports.getLeaveAttendanceById = async (req, res) => { res.status(501).json({ message: "Not Implemented: getLeaveAttendanceById" }); };
exports.createLeaveAttendance = async (req, res) => { res.status(501).json({ message: "Not Implemented: createLeaveAttendance" }); };
exports.updateLeaveAttendance = async (req, res) => { res.status(501).json({ message: "Not Implemented: updateLeaveAttendance" }); };
exports.deleteLeaveAttendance = async (req, res) => { res.status(501).json({ message: "Not Implemented: deleteLeaveAttendance" }); };

// --- Shift Management ---

// Get all shifts
exports.getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.status(200).json(shifts);
  } catch (error) {
    console.error("Error fetching all shifts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new shift
exports.createShift = async (req, res) => {
  const { name, startTime, endTime } = req.body;

  // Validation
  if (!name || !startTime || !endTime) {
    return res.status(400).json({ message: "Missing required fields: name, startTime, endTime" });
  }

  try {
    const newShift = new Shift({ name, startTime, endTime });
    await newShift.save();
    res.status(201).json(newShift);
  } catch (error) {
    console.error("Error creating shift:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing shift by ID
exports.updateShift = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const shift = await Shift.findByIdAndUpdate(id, updates, { new: true });
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    res.status(200).json(shift);
  } catch (error) {
    console.error("Error updating shift:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a shift by ID
exports.deleteShift = async (req, res) => {
  const { id } = req.params;

  try {
    const shift = await Shift.findByIdAndDelete(id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting shift:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- Shift Assignment Management ---

// Get all shift assignments
exports.getAllShiftAssignments = async (req, res) => {
  try {
    const assignments = await ShiftAssignment.find()
      .populate('staff', '-password') // Populate staff details, exclude password
      .populate('shift'); // Populate shift details
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching all shift assignments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single shift assignment by ID
exports.getShiftAssignmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await ShiftAssignment.findById(id)
      .populate('staff', '-password') // Populate staff details, exclude password
      .populate('shift'); // Populate shift details
    if (!assignment) {
      return res.status(404).json({ message: "Shift assignment not found" });
    }
    res.status(200).json(assignment);
  } catch (error) {
    console.error("Error fetching shift assignment by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Implement remaining Shift Assignment controller functions (create, update, delete) in subsequent steps
// For now, these are placeholders to match the routes defined in staffRoutes.js
exports.createShiftAssignment = async (req, res) => { res.status(501).json({ message: "Not Implemented: createShiftAssignment" }); };
exports.updateShiftAssignment = async (req, res) => { res.status(501).json({ message: "Not Implemented: updateShiftAssignment" }); };
exports.deleteShiftAssignment = async (req, res) => { res.status(501).json({ message: "Not Implemented: deleteShiftAssignment" }); };



// Get a single staff member by ID
exports.getStaffById = async (req, res) => {
  const { id } = req.params;

  try {
    const staffMember = await User.findById(id).select('-password'); // Exclude password
    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json(staffMember);
  } catch (error) {
    console.error("Error fetching staff member by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new staff member
exports.createStaff = async (req, res) => {
  const { name, email, password, role, employeeId, designation, department, contact, hireDate, isActive } = req.body;
  const { phone, address } = contact || {};

  // Basic validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields: name, email, password, role" });
  }

  if (role !== 'doctor' && role !== 'user') {
      return res.status(400).json({ message: "Invalid role specified." });
  }

  // Basic email format validation (can be enhanced)
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }


  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    if (employeeId) {
        const existingEmployee = await User.findOne({ employeeId });
        if (existingEmployee) {
            return res.status(409).json({ message: "Employee ID already in use" });
        }
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new User({
        name,
        email,
        password: hashedPassword,
        role,
        employeeId,
        designation,
        department,
        contact: { phone, address },
        hireDate,
        isActive
    });

    await newStaff.save();

    // Exclude password from the response
    const staffResponse = newStaff.toObject();
    delete staffResponse.password;

    res.status(201).json(staffResponse);
  } catch (error) {
    console.error("Error creating staff member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing staff member by ID
exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

   // Prevent password update through this route
  if (updates.password) {
    delete updates.password;
  }

  try {
    const staffMember = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password'); // Exclude password
    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json(staffMember);
  } catch (error) {
    console.error("Error updating staff member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a user by ID
exports.deleteStaff = async (req, res) => {
  const { id } = req.params;

  try {
    const staffMember = await User.findByIdAndDelete(id);
    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting staff member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};