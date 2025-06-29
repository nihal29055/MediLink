import React, { useState, useEffect } from 'react';

const PrescriptionLinkToPharmacy = ({ prescriptionId }) => {
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linking, setLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);

  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/prescriptions/${prescriptionId}`); // Assuming this endpoint exists
        if (!response.ok) {
          throw new Error('Failed to fetch prescription details.');
        }
        const data = await response.json();
        setPrescriptionDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (prescriptionId) {
      fetchPrescriptionDetails();
    }
  }, [prescriptionId]);

  const handleLinkToPharmacy = async () => {
    try {
      setLinking(true);
      setError(null);
      // Assuming a backend endpoint to send prescription to pharmacy
      const response = await fetch(`/api/pharmacy/link-prescription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prescriptionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to link prescription to pharmacy.');
      }

      setLinkSuccess(true);
      console.log('Prescription successfully linked to pharmacy.'); // Or show a user-friendly message
    } catch (err) {
      setError(err.message);
      setLinkSuccess(false);
    } finally {
      setLinking(false);
    }
  };

  if (!prescriptionId) {
    return <div>Please provide a Prescription ID.</div>;
  }

  if (loading) {
    return <div>Loading prescription details...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!prescriptionDetails) {
    return <div>Prescription details not found.</div>;
  }

  return (
    <div>
      <h2>Link Prescription to Pharmacy</h2>
      <div>
        <strong>Prescription ID:</strong> {prescriptionDetails._id}
      </div>
      <div>
        <strong>Patient:</strong> {prescriptionDetails.patient?.name || 'N/A'}
      </div>
      <div>
        <strong>Doctor:</strong> {prescriptionDetails.doctor?.name || 'N/A'}
      </div>
      {/* Display other relevant prescription details as needed */}
      {/* Example: List of medications */}
      {prescriptionDetails.medications && (
        <div>
          <strong>Medications:</strong>
          <ul>
            {prescriptionDetails.medications.map((med, index) => (
              <li key={index}>{med.name} - {med.dosage}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleLinkToPharmacy} disabled={linking || linkSuccess}>
        {linking ? 'Linking...' : linkSuccess ? 'Linked!' : 'Send to Pharmacy'}
      </button>

      {linkSuccess && <div style={{ color: 'green' }}>Prescription successfully sent to pharmacy.</div>}
    </div>
  );
};

export default PrescriptionLinkToPharmacy;