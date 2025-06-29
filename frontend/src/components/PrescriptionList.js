import React, { useState, useEffect } from 'react';

const PrescriptionList = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/patients/${patientId}/prescriptions`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPrescriptions(data);
      } catch (err) {
        setError(err);
        console.error("Error fetching prescriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);

  if (loading) {
    return <div>Loading prescriptions...</div>;
  }

  if (error) {
    return <div>Error fetching prescriptions: {error.message}</div>;
  }

  if (prescriptions.length === 0) {
    return <div>No prescriptions found for this patient.</div>;
  }

  return (
    <div>
      <h2>Prescriptions</h2>
      <ul>
        {prescriptions.map((prescription) => (
          <li key={prescription._id}>
            <p><strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
            <p><strong>Doctor:</strong> {prescription.doctor ? prescription.doctor.name : 'N/A'}</p>
            {/* Assuming prescription details are in a 'medications' array or similar */}
            {prescription.medications && (
              <div>
                <strong>Medications:</strong>
                <ul>
                  {prescription.medications.map((med, index) => (
                    <li key={index}>
                      {med.name} - {med.dosage} ({med.frequency})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Add a link or button here to view prescription details */}
            {/* <button onClick={() => onViewDetails(prescription._id)}>View Details</button> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrescriptionList;