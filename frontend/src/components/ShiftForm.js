import React, { useState, useEffect } from 'react';

const ShiftForm = ({ shift, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shift) {
      setFormData({
        name: shift.name || '',
        startTime: shift.startTime || '',
        endTime: shift.endTime || '',
      });
    }
  }, [shift]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.name || !formData.startTime || !formData.endTime) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    const url = shift ? `/api/staff/shifts/${shift._id}` : '/api/staff/shifts';
    const method = shift ? 'PUT' : 'POST';

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
        throw new Error(errorData.message || 'Failed to save shift');
      }

      // const savedShift = await response.json();
      // console.log('Shift saved successfully:', savedShift);

      if (onSuccess) {
        onSuccess(); // Call the success callback
      }

      // Optionally reset form if adding a new shift
      if (!shift) {
        setFormData({
          name: '',
          startTime: '',
          endTime: '',
        });
      }

    } catch (err) {
      console.error('Error saving shift:', err);
      setError(err.message || 'An error occurred while saving the shift.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{shift ? 'Edit Shift' : 'Add New Shift'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="name">Shift Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="startTime">Start Time:</label>
        <input
          type="text"
          id="startTime"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="endTime">End Time:</label>
        <input
          type="text"
          id="endTime"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : (shift ? 'Update Shift' : 'Add Shift')}
      </button>
    </form>
  );
};

export default ShiftForm;