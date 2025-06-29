import React, { useState } from 'react';

const PatientRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    medicalHistory: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (formData.age && isNaN(formData.age)) newErrors.age = 'Age must be a number';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.email) newErrors.email = 'Email is required';
    // Basic email format validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const patientData = {
        name: formData.name,
        age: parseInt(formData.age), // Ensure age is a number
        gender: formData.gender,
        medicalHistory: formData.medicalHistory,
        contactInfo: {
          phone: formData.phone,
          email: formData.email,
        },
      };

      fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Patient registered successfully:', data);
        // You can add logic here to clear the form or redirect
      })
      .catch(error => {
        console.error('Error registering patient:', error);
        // Display error message to the user
        setErrors(prevErrors => ({ ...prevErrors, submit: 'Error registering patient.' }));
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      </div>
      <div>
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
        {errors.age && <span style={{ color: 'red' }}>{errors.age}</span>}
      </div>
      <div>
        <label htmlFor="gender">Gender:</label>
        <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <span style={{ color: 'red' }}>{errors.gender}</span>}
      </div>
      <div>
        <label htmlFor="medicalHistory">Medical History:</label>
        <textarea
          id="medicalHistory"
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <span style={{ color: 'red' }}>{errors.phone}</span>}
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>
      <button type="submit">Register Patient</button>
    </form>
  );
};

export default PatientRegistrationForm;