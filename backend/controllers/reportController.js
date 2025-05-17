const Report = require("../models/Report");

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