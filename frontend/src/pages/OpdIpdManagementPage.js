import React from 'react';
import AddOpdIpdRecordForm from '../components/AddOpdIpdRecordForm';
import OpdIpdRecordList from '../components/OpdIpdRecordList';

const OpdIpdManagementPage = () => {
  return (
    <div>
      <h2>OPD/IPD Management</h2>
      <AddOpdIpdRecordForm />
      <OpdIpdRecordList />
    </div>
  );
};

export default OpdIpdManagementPage;