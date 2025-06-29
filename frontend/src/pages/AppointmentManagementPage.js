import React from 'react';
import ScheduleAppointmentForm from '../components/ScheduleAppointmentForm';
import AppointmentList from '../components/AppointmentList';

const AppointmentManagementPage = () => {
  return (
    <div>
      <h1>Appointment Management</h1>
      <ScheduleAppointmentForm />
      <AppointmentList />
    </div>
  );
};

export default AppointmentManagementPage;