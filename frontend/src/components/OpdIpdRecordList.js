import React, { useEffect, useState } from 'react';

const OpdIpdRecordList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/patients/opdipd'); // Adjust the API endpoint if necessary
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return <div>Loading OPD/IPD records...</div>;
  }

  if (error) {
    return <div>Error fetching records: {error.message}</div>;
  }

  return (
    <div>
      <h2>OPD/IPD Records</h2>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Visit Type</th>
              <th>Date</th>
              <th>Doctor</th>
              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td>{record.patient ? record.patient.name : 'N/A'}</td>
                <td>{record.visitType}</td>
                <td>{new Date(record.visitDate).toLocaleDateString()}</td>
                <td>{record.doctor ? record.doctor.name : 'N/A'}</td>
                {/* Add more data points as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OpdIpdRecordList;