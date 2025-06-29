import React, { useEffect, useState } from 'react';

const ShiftList = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await fetch('/api/staff/shifts'); // Assuming this is your backend endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setShifts(data);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch shifts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, []); // Empty dependency array means this effect runs only once after the initial render

  if (loading) {
    return <div>Loading shifts...</div>;
  }

  if (error) {
    return <div>Error loading shifts: {error.message}</div>;
  }

  if (shifts.length === 0) {
    return <div>No shifts found.</div>;
  }

  return (
    <div>
      <h2>Shift List</h2>
      <ul>
        {shifts.map(shift => (
          <li key={shift._id}>
            {shift.name}: {shift.startTime} - {shift.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShiftList;