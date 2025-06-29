import React, { useState, useEffect } from 'react';

const PatientAppointments = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/patients/${patientId}/appointments`); // Assuming this endpoint exists
        if (!response.ok) {
          throw new Error(`Error fetching appointments: ${response.statusText}`);
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err);
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Upcoming Appointments</h2>
      {appointments.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              <p>Doctor: {appointment.doctor.name}</p> {/* Assuming doctor is populated */}
              <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
              <p>Time: {appointment.time}</p>
              <p>Status: {appointment.status}</p>
              {appointment.purpose && <p>Purpose: {appointment.purpose}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientAppointments;