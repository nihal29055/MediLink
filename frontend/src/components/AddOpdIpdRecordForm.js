import React, { useState, useEffect } from 'react';

function AddOpdIpdRecordForm() {
  const [formData, setFormData] = useState({
    patient: '',
    visitType: 'OPD',
    visitDate: '',
    doctor: '',
    diagnosis: '',
    treatmentPlan: '',
    bed: ''
  });
  const [patients, setPatients] = useState([]); // To store list of patients for select
  const [doctors, setDoctors] = useState([]); // To store list of doctors for select
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState(null);

  useEffect(() => {
    // Fetch patients and doctors when component mounts
    const fetchPatientsAndDoctors = async () => {
      try {
        // Fetch patients
        const patientsResponse = await fetch('/api/patients'); // Assuming an endpoint for all patients
        if (!patientsResponse.ok) {
          throw new Error('Failed to fetch patients');
        }
        const patientsData = await patientsResponse.json();
        setPatients(patientsData);

        // Fetch doctors (assuming doctors are users with role 'doctor')
        const doctorsResponse = await fetch('/api/staff?role=doctor'); // Assuming an endpoint to filter staff by role
        if (!doctorsResponse.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsAndDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setSubmitMessage(null); // Clear previous messages on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Basic validation
    if (!formData.patient || !formData.visitType || !formData.visitDate || !formData.doctor) {
      setError("Please fill in all required fields.");
      return;
    }
    if (formData.visitType === 'IPD' && !formData.bed) {
        setError("Bed is required for IPD visit type.");
        return;
    }

    try {
      const response = await fetch('/api/patients/opdipd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage('OPD/IPD Record added successfully!');
        // Optionally reset the form
        setFormData({
          patient: '',
          visitType: 'OPD',
          visitDate: '',
          doctor: '',
          diagnosis: '',
          treatmentPlan: '',
          bed: ''
        });
      } else {
        setError(result.message || 'Failed to add OPD/IPD record.');
      }
    } catch (error) {
      setError('An error occurred while submitting the form.');
      console.error('Submit error:', error);
    }
  };

  if (loading) {
    return <div>Loading patients and doctors...</div>;
  }

  if (error && !submitMessage) {
      return <div style={{ color: 'red' }}>Error: {error}</div>;
  }


  return (
    <div>
      <h2>Add OPD/IPD Record</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="patient">Patient:</label>
          <select
            id="patient"
            name="patient"
            value={formData.patient}
            onChange={handleChange}
            required
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient._id} value={patient._id}>{patient.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="visitType">Visit Type:</label>
          <select
            id="visitType"
            name="visitType"
            value={formData.visitType}
            onChange={handleChange}
            required
          >
            <option value="OPD">OPD</option>
            <option value="IPD">IPD</option>
          </select>
        </div>
        <div>
          <label htmlFor="visitDate">Visit Date:</label>
          <input
            type="date"
            id="visitDate"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="doctor">Doctor:</label>
          <select
            id="doctor"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map(doctor => (
              <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="diagnosis">Diagnosis:</label>
          <textarea
            id="diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="treatmentPlan">Treatment Plan:</label>
          <textarea
            id="treatmentPlan"
            name="treatmentPlan"
            value={formData.treatmentPlan}
            onChange={handleChange}
          />
        </div>
        {formData.visitType === 'IPD' && (
          <div>
            <label htmlFor="bed">Bed:</label>
            <input
              type="text" // Could be a select or input with suggestions for beds
              id="bed"
              name="bed"
              value={formData.bed}
              onChange={handleChange}
            />
          </div>
        )}
        <button type="submit">Add Record</button>
      </form>
      {submitMessage && <div style={{ color: 'green' }}>{submitMessage}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default AddOpdIpdRecordForm;