import React, { useEffect, useState } from 'react';

const ShiftAssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/api/staff/shiftassignments'); // Adjust API endpoint if necessary
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAssignments(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return <div>Loading shift assignments...</div>;
  }

  if (error) {
    return <div>Error fetching shift assignments: {error.message}</div>;
  }

  return (
    <div>
      <h2>Shift Assignments</h2>
      {assignments.length === 0 ? (
        <p>No shift assignments found.</p>
      ) : (
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment._id}>
              Staff: {assignment.staff?.name || 'N/A'} - Shift: {assignment.shift?.name || 'N/A'} - Date: {new Date(assignment.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShiftAssignmentList;