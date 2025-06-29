import React, { useEffect, useState } from 'react';

const LeaveAttendanceList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/staff/leaveattendance'); // Adjust endpoint as needed
        if (!response.ok) {
          throw new Error(`Error fetching leave and attendance records: ${response.statusText}`);
        }
        const data = await response.json();
        setRecords(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return <div>Loading leave and attendance records...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Leave and Attendance Records</h2>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <ul>
          {records.map(record => (
            <li key={record._id}>
              Staff: {record.staff?.name || 'N/A'}, Date: {new Date(record.date).toLocaleDateString()}, Status: {record.status}
              {record.leaveType && `, Leave Type: ${record.leaveType}`}
              {record.reason && `, Reason: ${record.reason}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeaveAttendanceList;