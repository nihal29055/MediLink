import React, { useState, useEffect } from 'react';

const SurgicalCaseTracking = ({ patientId }) => {
  const [surgicalCases, setSurgicalCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  useEffect(() => {
    const fetchSurgicalCases = async () => {
      try {
        setLoading(true);
        // Assuming backend endpoint for surgical cases is /api/patients/:patientId/surgicalcases
        const response = await fetch(`/api/patients/${patientId}/surgicalcases`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSurgicalCases(data);
      } catch (error) {
        setError(error);
        console.error('Error fetching surgical cases:', error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchSurgicalCases();
    }
  }, [patientId]);

  const handleAddCase = () => {
    setEditingCase(null);
    setShowForm(true);
  };

  const handleEditCase = (caseData) => {
    setEditingCase(caseData);
    setShowForm(true);
  };

  const handleDeleteCase = async (caseId) => {
    try {
      // Assuming backend endpoint for deleting a surgical case is /api/surgicalcases/:caseId
      const response = await fetch(`/api/surgicalcases/${caseId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Remove the deleted case from the state
      setSurgicalCases(surgicalCases.filter(caseItem => caseItem._id !== caseId));
    } catch (error) {
      console.error('Error deleting surgical case:', error);
      // Optionally display an error message to the user
    }
  };

  const handleFormSubmit = (newCase) => {
    if (editingCase) {
      // Update existing case in state
      setSurgicalCases(surgicalCases.map(caseItem =>
        caseItem._id === newCase._id ? newCase : caseItem
      ));
    } else {
      // Add new case to state
      setSurgicalCases([...surgicalCases, newCase]);
    }
    setShowForm(false);
    setEditingCase(null);
  };

  if (loading) {
    return <div>Loading surgical cases...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h3>Surgical Case Tracking</h3>
      <button onClick={handleAddCase}>Add New Surgical Case</button>

      {showForm && (
        <SurgicalCaseForm
          patientId={patientId}
          caseData={editingCase}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {surgicalCases.length === 0 ? (
        <p>No surgical cases found for this patient.</p>
      ) : (
        <ul>
          {surgicalCases.map((caseItem) => (
            <li key={caseItem._id}>
              <h4>{caseItem.procedureName}</h4>
              <p>Date: {new Date(caseItem.date).toLocaleDateString()}</p>
              <p>Surgeon: {caseItem.surgeonName}</p> {/* Assuming surgeonName is available */}
              <p>Outcome: {caseItem.outcome}</p>
              <button onClick={() => handleEditCase(caseItem)}>Edit</button>
              <button onClick={() => handleDeleteCase(caseItem._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Placeholder for the SurgicalCaseForm component (needs to be created separately)
const SurgicalCaseForm = ({ patientId, caseData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patient: patientId,
    procedureName: '',
    date: '',
    surgeon: '', // Assuming surgeon is a user ID
    outcome: '',
    ...caseData, // Populate form if editing
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = caseData ? 'PUT' : 'POST';
      const url = caseData ? `/api/surgicalcases/${caseData._id}` : '/api/surgicalcases';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedCase = await response.json();
      onSubmit(savedCase);
    } catch (error) {
      console.error('Error saving surgical case:', error);
      // Optionally display an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>{caseData ? 'Edit Surgical Case' : 'Add New Surgical Case'}</h4>
      <div>
        <label htmlFor="procedureName">Procedure Name:</label>
        <input
          type="text"
          id="procedureName"
          name="procedureName"
          value={formData.procedureName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="surgeon">Surgeon (ID):</label>
        <input
          type="text"
          id="surgeon"
          name="surgeon"
          value={formData.surgeon}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="outcome">Outcome:</label>
        <textarea
          id="outcome"
          name="outcome"
          value={formData.outcome}
          onChange={handleChange}
        ></textarea>
      </div>
      <button type="submit">Save Case</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};


export default SurgicalCaseTracking;