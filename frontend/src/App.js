import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PatientRegistrationPage from '/home/user/MediLink/frontend/src/pages/PatientRegistrationPage'; // Use absolute path

import OpdIpdManagementPage from '/home/user/MediLink/frontend/src/pages/OpdIpdManagementPage';
import AppointmentManagementPage from '/home/user/MediLink/frontend/src/pages/AppointmentManagementPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Basic home route */}
          <Route path="/" element={<div>Home Page</div>} />

          {/* Route for Patient Registration */}
          <Route path="/register-patient" element={<PatientRegistrationPage />} />

          {/* Route for OPD/IPD Management */}
          <Route path="/opd-ipd" element={<OpdIpdManagementPage />} />

          {/* Route for Appointment Management */}
          <Route path="/appointments" element={<AppointmentManagementPage />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
