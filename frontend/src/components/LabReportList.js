import React, { useEffect, useState } from 'react';

const LabReportList = () => {
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLabReports = async () => {
      try {
        const response = await fetch('/api/reports/lab');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLabReports(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lab reports:', error);
        setError('Failed to fetch lab reports.');
        setLoading(false);
      }
    };

    fetchLabReports();
  }, []);

  if (loading) {
    return <div>Loading lab reports...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Lab Reports</h2>
      {labReports.length === 0 ? (
        <p>No lab reports found.</p>
      ) : (
        <ul>
          {labReports.map((report) => (
            <li key={report._id}>
              Patient: {report.patient?.name || 'N/A'} - Type: {report.type} - Order Date: {new Date(report.orderDate).toLocaleDateString()}
              {report.reportDate && ` - Report Date: ${new Date(report.reportDate).toLocaleDateString()}`}
              {/* Add a link or button to view report details */}
              {/* <button onClick={() => onViewDetails(report._id)}>View Details</button> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LabReportList;