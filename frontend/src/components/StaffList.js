import React, { useEffect, useState } from 'react';

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/staff'); // Assuming this endpoint returns all staff
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Optional: Filter for specific roles if needed
        const doctorsAndNurses = data.filter(member => member.role === 'doctor' || member.role === 'nurse');
        setStaff(doctorsAndNurses);
      } catch (error) {
        setError(error);
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (loading) {
    return <div>Loading staff...</div>;
  }

  if (error) {
    return <div>Error loading staff: {error.message}</div>;
  }

  if (staff.length === 0) {
    return <div>No staff members found.</div>;
  }

  return (
    <div>
      <h2>Staff List (Doctors and Nurses)</h2>
      <ul>
        {staff.map(member => (
          <li key={member._id}>
            <strong>{member.name}</strong> - {member.role} ({member.department})<br />
            Contact: {member.contact?.phone || 'N/A'}, {member.contact?.address || 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaffList;