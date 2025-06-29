import React, { useState } from 'react';
import StaffList from '../components/StaffList';
import StaffForm from '../components/StaffForm';

const StaffManagementPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const handleAddStaffClick = () => {
    setSelectedStaff(null); // Clear selected staff when adding
    setShowAddForm(true);
  };

  const handleStaffSelectForEdit = (staff) => {
    setSelectedStaff(staff);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setSelectedStaff(null);
    // Ideally, you would also refetch the staff list here
  };

  return (
    <div>
      <h2>Staff Management</h2>
      {!showAddForm && (
        <button onClick={handleAddStaffClick}>Add New Staff</button>
      )}

      {showAddForm && (
        <StaffForm staff={selectedStaff} onClose={handleFormClose} />
      )}

      <h3>Staff List</h3>
      <StaffList onStaffSelect={handleStaffSelectForEdit} />
    </div>
  );
};

export default StaffManagementPage;