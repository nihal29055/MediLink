import React, { useState, useEffect } from 'react';

const ShiftAssignmentForm = ({ assignment, onSave }) => {
  const [formData, setFormData] = useState({
    staff: assignment ? assignment.staff._id : '',
    shift: assignment ? assignment.shift._id : '',
    date: assignment ? new Date(assignment.date).toISOString().split('T')[0] : '',
  });
  const [staffList, setStaffList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch staff list (assuming an endpoint exists)
        const staffRes = await fetch('/api/staff');
        if (!staffRes.ok) {
          throw new Error('Failed to fetch staff');
        }
        const staffData = await staffRes.json();
        setStaffList(staffData);

        // Fetch shift list (assuming an endpoint exists)
        const shiftRes = await fetch('/api/staff/shifts');
        if (!shiftRes.ok) {
          throw new Error('Failed to fetch shifts');
        }
        const shiftData = await shiftRes.json();
        setShiftList(shiftData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.staff || !formData.shift || !formData.date) {
      alert('Please fill in all required fields.');
      return;
    }

    const url = assignment
      ? `/api/staff/shiftassignments/${assignment._id}`
      : '/api/staff/shiftassignments';
    const method = assignment ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save shift assignment.');
      }

      const savedAssignment = await response.json();
      if (onSave) {
        onSave(savedAssignment);
      }
      // Optional: clear form or show success message
      setFormData({ staff: '', shift: '', date: '' });
    } catch (err) {
      console.error('Error saving shift assignment:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading form data...</div>;
  }

  if (error) {
    return <div>Error loading form data: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="staff">Staff:</label>
        <select name="staff" id="staff" value={formData.staff} onChange={handleChange} required>
          <option value="">Select Staff</option>
          {staffList.map((staff) => (
            <option key={staff._id} value={staff._id}>{staff.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="shift">Shift:</label>
        <select name="shift" id="shift" value={formData.shift} onChange={handleChange} required>
          <option value="">Select Shift</option>
          {shiftList.map((shift) => (
            <option key={shift._id} value={shift._id}>{shift.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          name="date"
          id="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">{assignment ? 'Update Assignment' : 'Create Assignment'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default ShiftAssignmentForm;