import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar'; // You might need to install react-calendar
import 'react-calendar/dist/Calendar.css'; // And its CSS

const DoctorAppointmentCalendar = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/doctors/${doctorId}/appointments`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error loading appointments: {error.message}</div>;
  }

  // Function to mark dates with appointments
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.getDate() === date.getDate() &&
               appointmentDate.getMonth() === date.getMonth() &&
               appointmentDate.getFullYear() === date.getFullYear();
      });
      return dateAppointments.length > 0 ? <p>{dateAppointments.length}</p> : null;
    }
    return null;
  };

  // Function to handle date clicks (optional)
  const handleDateClick = (value) => {
    // You can implement logic here to show appointment details for the clicked date
    console.log('Clicked date:', value);
    const dateAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getDate() === value.getDate() &&
             appointmentDate.getMonth() === value.getMonth() &&
             appointmentDate.getFullYear() === value.getFullYear();
    });
    console.log('Appointments on this date:', dateAppointments);
    // You might want to open a modal or navigate to a details page
  };

  return (
    <div>
      <h2>Doctor Appointment Calendar</h2>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent}
        onClickDay={handleDateClick} // Optional: handle date clicks
      />
      {/* You can add a section here to display appointments for the selected date */}
    </div>
  );
};

export default DoctorAppointmentCalendar;