import React, { useState, useEffect } from 'react';

const PatientReports = ({ patientId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // Assuming backend endpoint to fetch all reports for a patient
        const response = await fetch(`/api/patients/${patientId}/reports`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReports(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchReports();
    }
  }, [patientId]);

  if (loading) {
    return <div>Loading reports...</div>;
  }

  if (error) {
    return <div>Error fetching reports: {error.message}</div>;
  }

  if (reports.length === 0) {
    return <div>No reports found for this patient.</div>;
  }

  return (
    <div>
      <h2>Patient Reports</h2>
      <ul>
        {reports.map(report => (
          <li key={report._id}>
            {/* Display essential report information */}
            Report Type: {report.type}, Date: {new Date(report.reportDate || report.orderDate).toLocaleDateString()}
            {/* Add more details or a link to view full report */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientReports;