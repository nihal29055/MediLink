import React, { useState, useEffect } from 'react';

const LeaveAttendanceForm = ({ attendance, onSubmit }) => {
  const [formData, setFormData] = useState({
    staff: '',
    date: '',
    status: 'present',
    leaveType: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [staffOptions, setStaffOptions] = useState([]); // State for staff dropdown options

  useEffect(() => {
    if (attendance) {
      setFormData({
        staff: attendance.staff?._id || '',
        date: attendance.date ? new Date(attendance.date).toISOString().split('T')[0] : '', // Format date for input
        status: attendance.status || 'present',
        leaveType: attendance.leaveType || '',
        reason: attendance.reason || '',
      });
    }
  }, [attendance]);

  useEffect(() => {
    // Fetch staff options for the dropdown
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/staff'); // Assuming this endpoint exists
        if (!response.ok) {
          throw new Error('Failed to fetch staff');
        }
        const data = await response.json();
        setStaffOptions(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
        // Handle error appropriately
      }
    };

    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.staff || !formData.date || !formData.status) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const url = attendance
      ? `/api/staff/leaveattendance/${attendance._id}`
      : '/api/staff/leaveattendance';
    const method = attendance ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Include authorization token if needed
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save leave/attendance record.');
      }

      const savedRecord = await response.json();
      console.log('Record saved successfully:', savedRecord);
      if (onSubmit) {
        onSubmit(savedRecord);
      }
      // Optionally clear form or provide feedback
      setFormData({
        staff: '',
        date: '',
        status: 'present',
        leaveType: '',
        reason: '',
      });
    } catch (error) {
      console.error('Error saving record:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="staff">Staff:</label>
        <select
          id="staff"
          name="staff"
          value={formData.staff}
          onChange={handleChange}
          required
        >
          <option value="">Select Staff</option>
          {staffOptions.map(staff => (
            <option key={staff._id} value={staff._id}>
              {staff.name} ({staff.role})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
        </select>
      </div>
      {(formData.status === 'leave') && (
        <div>
          <label htmlFor="leaveType">Leave Type:</label>
          <input
            type="text"
            id="leaveType"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
          />
        </div>
      )}
      {(formData.status === 'absent' || formData.status === 'leave') && (
        <div>
          <label htmlFor="reason">Reason:</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
          />
        </div>
      )}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : (attendance ? 'Update Record' : 'Add Record')}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default LeaveAttendanceForm;