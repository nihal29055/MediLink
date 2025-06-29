import React, { useState, useEffect } from 'react';

const MedicalHistory = ({ patientId }) => {
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/patients/${patientId}/medicalhistory`);
        if (!response.ok) {
          throw new Error(`Error fetching medical history: ${response.statusText}`);
        }
        const data = await response.json();
        setMedicalHistory(data.medicalHistory); // Assuming the medical history is nested like this
      } catch (err) {
        setError(err);
        console.error("Error fetching medical history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchMedicalHistory();
    }

  }, [patientId]);

  if (loading) {
    return <div>Loading medical history...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!medicalHistory) {
    return <div>No medical history found for this patient.</div>;
  }

  return (
    <div>
      <h3>Medical History</h3>
      <p>{medicalHistory}</p>
      {/* You might want to parse and format the medical history content */}
    </div>
  );
};

export default MedicalHistory;