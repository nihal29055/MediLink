import React, { useState, useEffect } from 'react';

const CarePlanAlerts = ({ patientId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarePlanAlerts = async () => {
      try {
        setLoading(true);
        // Assuming an API endpoint like '/api/patients/:patientId/careplanalerts'
        const response = await fetch(`/api/patients/${patientId}/careplanalerts`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setAlerts(data);
      } catch (err) {
        setError(err);
        console.error('Error fetching care plan alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchCarePlanAlerts();
    }

    return () => {
      // Cleanup if needed
    };
  }, [patientId]);

  if (loading) {
    return <div>Loading care plan alerts...</div>;
  }

  if (error) {
    return <div>Error loading care plan alerts: {error.message}</div>;
  }

  if (alerts.length === 0) {
    return <div>No care plan alerts found for this patient.</div>;
  }

  return (
    <div>
      <h3>Care Plan Alerts</h3>
      <ul>
        {alerts.map(alert => (
          <li key={alert._id}>
            <strong>Alert:</strong> {alert.message}
            {alert.carePlanInfo && (
              <span> - Related Care Plan: {alert.carePlanInfo}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarePlanAlerts;