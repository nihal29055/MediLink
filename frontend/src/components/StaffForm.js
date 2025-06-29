import React, { useState, useEffect } from 'react';

const StaffForm = ({ staff, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    employeeId: '',
    designation: '',
    department: '',
    contact: {
      phone: '',
      address: '',
    },
    hireDate: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || '',
        email: staff.email || '',
        password: '', // Password is not pre-populated for security
        role: staff.role || 'user',
        employeeId: staff.employeeId || '',
        designation: staff.designation || '',
        department: staff.department || '',
        contact: {
          phone: staff.contact?.phone || '',
          address: staff.contact?.address || '',
        },
        hireDate: staff.hireDate ? new Date(staff.hireDate).toISOString().split('T')[0] : '',
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    // Clear validation error for the changed field
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!staff && !formData.password.trim()) newErrors.password = 'Password is required for new staff';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.contact.phone.trim()) newErrors['contact.phone'] = 'Phone is required';
    // Add more validation rules as needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const method = staff ? 'PUT' : 'POST';
    const url = staff ? `/api/staff/${staff._id}` : '/api/staff';

    const dataToSend = { ...formData };
    if (staff && !dataToSend.password) {
      // Don't send password if editing and password field is empty
      delete dataToSend.password;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed, e.g., 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        alert(staff ? 'Staff updated successfully!' : 'Staff added successfully!');
        if (onSuccess) {
          onSuccess(result);
        }
        if (!staff) {
          // Clear form for new staff after successful submission
          setFormData({
            name: '',
            email: '',
            password: '',
            role: 'user',
            employeeId: '',
            designation: '',
            department: '',
            contact: {
              phone: '',
              address: '',
            },
            hireDate: '',
          });
        }
      } else {
        setSubmitError(result.message || `Failed to ${staff ? 'update' : 'add'} staff.`);
      }
    } catch (error) {
      console.error('Error submitting staff form:', error);
      setSubmitError('An error occurred while submitting the form.');
    } finally {
      setLoading(false);
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
      {!staff && ( // Only show password field for new staff
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
        </div>
      )}
      <div>
        <label htmlFor="role">Role:</label>
        <select id="role" name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="doctor">Doctor</option>
          {/* Add other roles as needed */}
        </select>
        {errors.role && <span style={{ color: 'red' }}>{errors.role}</span>}
      </div>
      <div>
        <label htmlFor="employeeId">Employee ID:</label>
        <input
          type="text"
          id="employeeId"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="designation">Designation:</label>
        <input
          type="text"
          id="designation"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="department">Department:</label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="contact.phone">Phone:</label>
        <input
          type="text"
          id="contact.phone"
          name="contact.phone"
          value={formData.contact.phone}
          onChange={handleChange}
        />
        {errors['contact.phone'] && <span style={{ color: 'red' }}>{errors['contact.phone']}</span>}
      </div>
      <div>
        <label htmlFor="contact.address">Address:</label>
        <input
          type="text"
          id="contact.address"
          name="contact.address"
          value={formData.contact.address}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="hireDate">Hire Date:</label>
        <input
          type="date"
          id="hireDate"
          name="hireDate"
          value={formData.hireDate}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? (staff ? 'Updating...' : 'Adding...') : (staff ? 'Update Staff' : 'Add Staff')}
      </button>
      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
    </form>
  );
};

export default StaffForm;