import React, { useEffect, useState } from 'react';

const ExpiryAlertsRestocking = () => {
  const [expiringMedications, setExpiringMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpiringMedications = async () => {
      try {
        // Assuming backend endpoint for expiring medications
        const response = await fetch('/api/pharmacy/expiring-medications');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExpiringMedications(data);
      } catch (error) {
        console.error('Error fetching expiring medications:', error);
        setError('Failed to fetch expiring medications.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringMedications();
  }, []);

  const handleRestock = async (medicationId) => {
    try {
      // Assuming backend endpoint to trigger restocking for a medication
      const response = await fetch(`/api/pharmacy/restock/${medicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // You might send additional data in the body if needed
        // body: JSON.stringify({ medicationId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle successful restocking request (e.g., show a success message, update the list)
      console.log(`Restock request sent for medication ID: ${medicationId}`);
      // You might want to re-fetch the list or update the state to reflect the restocking action
      // fetchExpiringMedications();

    } catch (error) {
      console.error(`Error triggering restock for medication ID ${medicationId}:`, error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (loading) {
    return <div>Loading expiring medications...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Expiring Medications Alerts</h2>
      {expiringMedications.length === 0 ? (
        <p>No medications with upcoming expiry dates.</p>
      ) : (
        <ul>
          {expiringMedications.map((medication) => (
            <li key={medication._id}>
              {medication.name} (Expires on: {new Date(medication.expiryDate).toLocaleDateString()})
              <button onClick={() => handleRestock(medication._id)} style={{ marginLeft: '10px' }}>
                Restock
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpiryAlertsRestocking;