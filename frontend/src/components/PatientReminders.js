import React, { useState, useEffect } from 'react';

const PatientReminders = ({ patientId }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        // Assuming a backend endpoint like /api/patients/:patientId/reminders
        const response = await fetch(`/api/patients/${patientId}/reminders`);
        if (!response.ok) {
          throw new Error(`Error fetching reminders: ${response.statusText}`);
        }
        const data = await response.json();
        setReminders(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (patientId) {
      fetchReminders();
    }
  }, [patientId]);

  if (loading) {
    return <div>Loading reminders...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Reminders</h2>
      {reminders.length === 0 ? (
        <p>No reminders found.</p>
      ) : (
        <ul>
          {reminders.map((reminder) => (
            <li key={reminder._id}>
              {/* Display reminder details */}
              <p>{reminder.message}</p>
              <p>Date: {new Date(reminder.date).toLocaleDateString()}</p>
              {reminder.time && <p>Time: {reminder.time}</p>}
              {/* Add more reminder details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientReminders;