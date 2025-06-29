const Report = require("../models/Report");
const LabReport = require("../models/LabReport");

exports.createReport = async (req, res) => {
  const { doctorId, patientName, reportType, fileUrl } = req.body;

  try {
    const newReport = new Report({ doctorId, patientName, reportType, fileUrl });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Lab Report Management
exports.getAllLabReports = async (req, res) => {
  try {
    const labReports = await LabReport.find()
      .populate('patient', 'name age gender contactInfo')
      .populate('orderedBy', 'name role');
    res.status(200).json(labReports);
  } catch (error) {
    console.error("Error fetching lab reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLabReportById = async (req, res) => {
  try {
    const labReport = await LabReport.findById(req.params.id)
      .populate('patient', 'name age gender contactInfo')
      .populate('orderedBy', 'name role')
      .populate('approvedBy', 'name role');

    if (!labReport) {
      return res.status(404).json({ message: "Lab report not found" });
    }
    res.status(200).json(labReport);
  } catch (error) {
    console.error("Error fetching lab report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createLabReport = async (req, res) => {
  const { patient, orderDate, reportDate, type, results, orderedBy, approvedBy, attachments } = req.body;

  // Validation
  if (!patient || !orderDate || !type || !results || !orderedBy) {
    return res.status(400).json({ message: "Missing required fields: patient, orderDate, type, results, orderedBy" });
  }

  try {
    const newLabReport = new LabReport({
      patient, orderDate, reportDate, type, results, orderedBy, approvedBy, attachments
    });
    await newLabReport.save();
    res.status(201).json(newLabReport);
  } catch (error) {
    console.error("Error creating lab report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateLabReport = async (req, res) => {
  try {
    const labReport = await LabReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!labReport) {
      return res.status(404).json({ message: "Lab report not found" });
    }
    res.status(200).json(labReport);
  } catch (error) {
    console.error("Error updating lab report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteLabReport = async (req, res) => {
};

exports.deleteLabReport = async (req, res) => {
  try {
    const labReport = await LabReport.findByIdAndDelete(req.params.id);
    if (!labReport) {
      return res.status(404).json({ message: "Lab report not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting lab report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getReportsByDoctor = async (req, res) => {
  const doctorId = req.user.id;

  try {
    const reports = await Report.find({ doctorId });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getReportById = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};