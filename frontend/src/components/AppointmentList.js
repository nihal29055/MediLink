import React, { useEffect, useState } from 'react';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/patients/appointments'); // Adjust API endpoint if necessary
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        setError(error);
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error loading appointments: {error.message}</div>;
  }

  if (appointments.length === 0) {
    return <div>No appointments found.</div>;
  }

  return (
    <div>
      <h2>Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            Patient: {appointment.patient ? appointment.patient.name : 'N/A'},{' '}
            Doctor: {appointment.doctor ? appointment.doctor.name : 'N/A'},{' '}
            Date: {new Date(appointment.date).toLocaleDateString()},{' '}
            Time: {appointment.time},{' '}
            Status: {appointment.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;