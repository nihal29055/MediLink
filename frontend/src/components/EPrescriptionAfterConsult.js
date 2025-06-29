import React, { useState } from 'react';

const EPrescriptionAfterConsult = ({ patientId, doctorId }) => {
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', instructions: '' }]);
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleMedicationChange = (index, event) => {
    const newMedications = [...medications];
    newMedications[index][event.target.name] = event.target.value;
    setMedications(newMedications);
  };

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', instructions: '' }]);
  };

  const handleRemoveMedication = (index) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const handleSignatureChange = (event) => {
    setSignature(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!medications.length || medications.some(med => !med.name || !med.dosage || !med.frequency) || !signature) {
      setError('Please fill in all required fields and provide a signature.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/prescriptions', { // Assuming a prescription creation endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({
          patient: patientId,
          doctor: doctorId,
          medications: medications.map(med => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            instructions: med.instructions
          })),
          signature: signature,
          date: new Date(), // Or capture a specific prescription date
          // Add other relevant fields like consultation ID if needed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create prescription');
      }

      // const newPrescription = await response.json(); // If the backend returns the new prescription
      setSuccess(true);
      setMedications([{ name: '', dosage: '', frequency: '', instructions: '' }]); // Clear form
      setSignature('');
    } catch (err) {
      console.error('Error creating prescription:', err);
      setError(err.message || 'An error occurred while creating the prescription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create E-Prescription</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>Prescription created successfully!</div>}
      <form onSubmit={handleSubmit}>
        <h3>Medications</h3>
        {medications.map((med, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <div>
              <label>Medication Name:</label>
              <input
                type="text"
                name="name"
                value={med.name}
                onChange={(e) => handleMedicationChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Dosage:</label>
              <input
                type="text"
                name="dosage"
                value={med.dosage}
                onChange={(e) => handleMedicationChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Frequency:</label>
              <input
                type="text"
                name="frequency"
                value={med.frequency}
                onChange={(e) => handleMedicationChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Instructions:</label>
              <textarea
                name="instructions"
                value={med.instructions}
                onChange={(e) => handleMedicationChange(index, e)}
              />
            </div>
            {medications.length > 1 && (
              <button type="button" onClick={() => handleRemoveMedication(index)}>Remove Medication</button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddMedication}>Add Medication</button>

        <h3>Signature</h3>
        <div>
          <label>Doctor's Signature:</label>
          <input
            type="text" // In a real app, this would be a signature pad or similar
            value={signature}
            onChange={handleSignatureChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Prescription'}
        </button>
      </form>
    </div>
  );
};

export default EPrescriptionAfterConsult;