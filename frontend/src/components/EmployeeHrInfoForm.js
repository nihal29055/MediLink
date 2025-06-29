import React, { useState, useEffect } from 'react';

const EmployeeHrInfoForm = ({ hrInfo, onSubmit }) => {
  const [formData, setFormData] = useState({
    staff: '',
    salary: '',
    bankAccount: '',
    taxInformation: '',
    hireDate: '',
    jobTitle: '',
    department: '',
  });

  useEffect(() => {
    if (hrInfo) {
      setFormData({
        staff: hrInfo.staff?._id || '', // Assuming staff is populated with _id
        salary: hrInfo.salary || '',
        bankAccount: hrInfo.bankAccount || '',
        taxInformation: hrInfo.taxInformation || '',
        hireDate: hrInfo.hireDate ? new Date(hrInfo.hireDate).toISOString().split('T')[0] : '',
        jobTitle: hrInfo.jobTitle || '',
        department: hrInfo.department || '',
      });
    }
  }, [hrInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.staff || !formData.salary || !formData.amount) {
      alert('Please fill in required fields: Staff, Salary, Amount');
      return;
    }

    const method = hrInfo ? 'PUT' : 'POST';
    const url = hrInfo ? `/api/staff/hrinfo/${hrInfo._id}` : '/api/staff/hrinfo';

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

      if (response.ok) {
        // Handle success (e.g., show a success message, clear the form)
        alert(`Employee HR Info ${hrInfo ? 'updated' : 'added'} successfully!`);
        if (!hrInfo) {
          setFormData({ // Clear form for new record
            staff: '',
            salary: '',
            bankAccount: '',
            taxInformation: '',
            hireDate: '',
            jobTitle: '',
            department: '',
          });
        }
        if (onSubmit) {
          onSubmit(); // Call a callback function if provided
        }
      } else {
        // Handle errors
        const errorData = await response.json();
        alert(`Error ${hrInfo ? 'updating' : 'adding'} employee HR info: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  // You would typically fetch a list of staff to populate the select dropdown
  // For simplicity, this example uses a basic text input.
  // You'll need to implement fetching and handling staff selection.

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="staff">Staff:</label>
        {/* Replace with a select or autocomplete for staff */}
        <input
          type="text"
          id="staff"
          name="staff"
          value={formData.staff}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="salary">Salary:</label>
        <input
          type="number"
          id="salary"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="bankAccount">Bank Account:</label>
        <input
          type="text"
          id="bankAccount"
          name="bankAccount"
          value={formData.bankAccount}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="taxInformation">Tax Information:</label>
        <input
          type="text"
          id="taxInformation"
          name="taxInformation"
          value={formData.taxInformation}
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
      <div>
        <label htmlFor="jobTitle">Job Title:</label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
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
      <button type="submit">{hrInfo ? 'Update' : 'Add'} HR Info</button>
    </form>
  );
};

export default EmployeeHrInfoForm;