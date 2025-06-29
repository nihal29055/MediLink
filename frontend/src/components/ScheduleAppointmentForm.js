import React, { useState } from 'react';

function ScheduleAppointmentForm() {
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    purpose: '',
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear validation error for the field when it changes
    setErrors({
      ...errors,
      [name]: '',
    });
    setSubmitStatus(null); // Clear submit status on change
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patient) newErrors.patient = 'Patient is required';
    if (!formData.doctor) newErrors.doctor = 'Doctor is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    // Add more specific validation if needed (e.g., date format, time format)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    try {
      const response = await fetch('/api/patients/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization header if needed
          // 'Authorization': `Bearer ${yourToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Appointment scheduled successfully:', data);
        setSubmitStatus('success');
        // Optionally clear the form or redirect
        setFormData({
          patient: '',
          doctor: '',
          date: '',
          time: '',
          purpose: '',
        });
      } else {
        console.error('Error scheduling appointment:', data);
        setSubmitStatus('error');
        // Display a user-friendly error message from the backend if available
        setErrors({ apiError: data.message || 'Failed to schedule appointment' });
      }
    } catch (error) {
      console.error('Network or other error:', error);
      setSubmitStatus('error');
      setErrors({ apiError: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div>
      <h2>Schedule New Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="patient">Patient:</label>
          <input
            type="text" // Or select/input with suggestions
            id="patient"
            name="patient"
            value={formData.patient}
            onChange={handleChange}
          />
          {errors.patient && <span style={{ color: 'red' }}>{errors.patient}</span>}
        </div>
        <div>
          <label htmlFor="doctor">Doctor:</label>
          <input
            type="text" // Or select/input with suggestions
            id="doctor"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
          />
          {errors.doctor && <span style={{ color: 'red' }}>{errors.doctor}</span>}
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <span style={{ color: 'red' }}>{errors.date}</span>}
        </div>
        <div>
          <label htmlFor="time">Time:</label>
          <input
            type="time" // Use type="time" for a time picker
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
          {errors.time && <span style={{ color: 'red' }}>{errors.time}</span>}
        </div>
        <div>
          <label htmlFor="purpose">Purpose:</label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Schedule Appointment</button>
        {submitStatus === 'success' && <p style={{ color: 'green' }}>Appointment scheduled successfully!</p>}
        {submitStatus === 'error' && errors.apiError && <p style={{ color: 'red' }}>{errors.apiError}</p>}
      </form>
    </div>
  );
}

export default ScheduleAppointmentForm;