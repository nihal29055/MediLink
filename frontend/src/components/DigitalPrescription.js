import React, { useState, useEffect } from 'react';

const DigitalPrescription = ({ patientId, doctorId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    instructions: '',
  });

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        // Assuming an endpoint like /api/patients/:patientId/prescriptions
        const response = await fetch(`/api/patients/${patientId}/prescriptions`);
        if (!response.ok) {
          throw new Error(`Error fetching prescriptions: ${response.statusText}`);
        }
        const data = await response.json();
        setPrescriptions(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching prescriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrescription({ ...newPrescription, [name]: value });
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!newPrescription.medication || !newPrescription.dosage || !newPrescription.frequency) {
      setError('Medication, Dosage, and Frequency are required.');
      return;
    }

    try {
      const response = await fetch('/api/prescriptions', { // Assuming a general prescriptions endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify({
          ...newPrescription,
          patient: patientId,
          doctor: doctorId,
          prescriptionDate: new Date(), // Add current date
        }),
      });

      if (!response.ok) {
        throw new Error(`Error creating prescription: ${response.statusText}`);
      }

      const addedPrescription = await response.json();
      setPrescriptions([...prescriptions, addedPrescription]);
      setNewPrescription({ medication: '', dosage: '', frequency: '', instructions: '' }); // Clear form
      console.log('Prescription created successfully:', addedPrescription);

    } catch (err) {
      setError(err.message);
      console.error('Error creating prescription:', err);
    }
  };

  if (loading) {
    return <div>Loading prescriptions...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Digital Prescriptions</h3>

      <h4>Add New Prescription</h4>
      <form onSubmit={handleSubmitPrescription}>
        <div>
          <label htmlFor="medication">Medication:</label>
          <input
            type="text"
            id="medication"
            name="medication"
            value={newPrescription.medication}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="dosage">Dosage:</label>
          <input
            type="text"
            id="dosage"
            name="dosage"
            value={newPrescription.dosage}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="frequency">Frequency:</label>
          <input
            type="text"
            id="frequency"
            name="frequency"
            value={newPrescription.frequency}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="instructions">Instructions:</label>
          <textarea
            id="instructions"
            name="instructions"
            value={newPrescription.instructions}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Add Prescription</button>
      </form>

      <h4>Existing Prescriptions</h4>
      {prescriptions.length === 0 ? (
        <p>No prescriptions found for this patient.</p>
      ) : (
        <ul>
          {prescriptions.map((prescription) => (
            <li key={prescription._id}>
              <p><strong>Medication:</strong> {prescription.medication}</p>
              <p><strong>Dosage:</strong> {prescription.dosage}</p>
              <p><strong>Frequency:</strong> {prescription.frequency}</p>
              {prescription.instructions && <p><strong>Instructions:</strong> {prescription.instructions}</p>}
              <p><strong>Date:</strong> {new Date(prescription.prescriptionDate).toLocaleDateString()}</p>
              {/* Display doctor's name if populated in backend */}
              {/* <p><strong>Doctor:</strong> {prescription.doctor?.name}</p> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DigitalPrescription;