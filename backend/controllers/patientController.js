const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const OpdIpdRecord = require("../models/OpdIpdRecord");

exports.createPatient = async (req, res) => {
  const { name, age, gender, medicalHistory, contactInfo } = req.body;
  const { phone, email } = contactInfo || {};

  // Basic validation
  if (!name || !age || !gender || !contactInfo || !phone || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (typeof name !== 'string' || typeof gender !== 'string') {
    return res.status(400).json({ message: "Invalid data types for name or gender" });
  }

  // Basic email format validation (can be enhanced)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (typeof age !== 'number' || age <= 0) {
    return res.status(400).json({ message: "Age must be a positive number" });
  }

  if (medicalHistory && typeof medicalHistory !== 'string') {
    return res.status(400).json({ message: "Invalid data type for medical history" });
  }

  try {
    const newPatient = new Patient({ name, age, gender, medicalHistory, contactInfo: { phone, email } });    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    console.error("Error creating patient:", error);
    if (error.code === 11000) { // Duplicate key error (for phone or email)
      return res.status(409).json({ message: "Patient with this phone number or email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controllers for OPD/IPD Management
exports.createOpdIpdRecord = async (req, res) => {
  const { patient, visitType, visitDate, doctor, diagnosis, treatmentPlan, bed } = req.body;

  // Validation
  if (!patient || !visitType || !visitDate || !doctor) {
    return res.status(400).json({ message: "Missing required fields: patient, visitType, visitDate, doctor" });
  }

  if (visitType !== 'OPD' && visitType !== 'IPD') {
    return res.status(400).json({ message: "Invalid visitType. Must be \'OPD\' or \'IPD\'." });
  }

  if (visitType === 'IPD' && !bed) {
    return res.status(400).json({ message: "Bed is required for IPD visitType." });
  }

  try {
    const newRecord = new OpdIpdRecord({
      patient,
      visitType,
      visitDate,
      doctor,
      diagnosis,
      treatmentPlan,
      bed: visitType === 'IPD' ? bed : undefined, // Only include bed for IPD
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error creating OPD/IPD record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOpdIpdRecord = async (req, res) => {
  try {
    const record = await OpdIpdRecord.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('bed'); // Populate referenced fields

    if (!record) {
      return res.status(404).json({ message: "OPD/IPD record not found" });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error("Error fetching OPD/IPD record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOpdIpdRecord = async (req, res) => {
exports.deleteOpdIpdRecord = async (req, res) => {
  try {
    const record = await OpdIpdRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) {
      return res.status(404).json({ message: "OPD/IPD record not found" });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error("Error updating OPD/IPD record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteOpdIpdRecord = async (req, res) => {
  try {
    const record = await OpdIpdRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "OPD/IPD record not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting OPD/IPD record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controllers for Appointment Scheduling
exports.createAppointment = async (req, res) => {
  const { patient, doctor, date, time, status, purpose } = req.body;

  // Validation
  if (!patient || !doctor || !date || !time) {
    return res.status(400).json({ message: "Missing required fields: patient, doctor, date, time" });
  }

  try {
    const newAppointment = new Appointment({
      patient,
      doctor,
      date,
      time,
      status: status || 'scheduled', // Default to 'scheduled' if not provided
      purpose,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor'); // Populate referenced fields

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPatient = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const patient = await Patient.findByIdAndUpdate(id, updates, { new: true });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};