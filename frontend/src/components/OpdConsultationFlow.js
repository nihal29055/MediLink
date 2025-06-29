import React, { useState, useEffect } from 'react';
import DigitalPrescription from './DigitalPrescription';
import CaseSheet from './CaseSheet';

const OpdConsultationFlow = ({ patientId, opdRecordId }) => {
  const [consultationData, setConsultationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultationData = async () => {
      try {
        setLoading(true);
        // Assuming an API endpoint to fetch OPD consultation data
        const response = await fetch(`/api/opdconsultations/${opdRecordId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch consultation data');
        }
        const data = await response.json();
        setConsultationData(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (opdRecordId) {
      fetchConsultationData();
    }
  }, [opdRecordId]);

  if (loading) {
    return <div>Loading consultation data...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!consultationData) {
    return <div>No consultation data available.</div>;
  }

  return (
    <div>
      <h2>OPD Consultation Details</h2>
      <p><strong>Date:</strong> {new Date(consultationData.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {consultationData.time}</p>
      <p><strong>Doctor:</strong> {consultationData.doctorName}</p> {/* Assuming doctorName is available */}
      <p><strong>Reason for Visit:</strong> {consultationData.reason}</p> {/* Assuming reason is available */}

      <h3>Medical Records</h3>
      {patientId && (
        <>
          <CaseSheet patientId={patientId} />
          <DigitalPrescription patientId={patientId} doctorId={consultationData.doctorId} /> {/* Assuming doctorId is available */}
        </>
      )}
    </div>
  );
};

export default OpdConsultationFlow;