import React, { useState, useEffect } from 'react';

const CaseSheet = ({ patientId }) => {
  const [caseSheetData, setCaseSheetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEntry, setNewEntry] = useState('');

  useEffect(() => {
    const fetchCaseSheet = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/patients/${patientId}/casesheet`); // Assuming this endpoint exists
        if (!response.ok) {
          throw new Error(`Error fetching case sheet: ${response.statusText}`);
        }
        const data = await response.json();
        setCaseSheetData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchCaseSheet();
    }
  }, [patientId]);

  const handleAddEntry = async () => {
    if (!newEntry.trim()) return;

    try {
      // Assuming an endpoint to add case sheet entries
      const response = await fetch(`/api/patients/${patientId}/casesheet/entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entry: newEntry }),
      });

      if (!response.ok) {
        throw new Error(`Error adding case sheet entry: ${response.statusText}`);
      }

      const updatedCaseSheet = await response.json();
      setCaseSheetData(updatedCaseSheet);
      setNewEntry(''); // Clear the input field
    } catch (err) {
      console.error('Error adding case sheet entry:', err);
      // Handle error, maybe display a message to the user
    }
  };

  if (loading) {
    return <div>Loading case sheet...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Case Sheet</h2>
      {caseSheetData ? (
        <div>
          {/* Display existing case sheet entries */}
          {caseSheetData.entries && caseSheetData.entries.length > 0 ? (
            <ul>
              {caseSheetData.entries.map((entry, index) => (
                <li key={index}>
                  <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
                  <p><strong>Doctor:</strong> {entry.doctorName}</p> {/* Assuming doctorName is available */}
                  <p>{entry.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No case sheet entries found.</p>
          )}

          {/* Form to add new entry */}
          <div>
            <h3>Add New Entry</h3>
            <textarea
              rows="4"
              cols="50"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Enter new case sheet entry"
            ></textarea>
            <button onClick={handleAddEntry}>Add Entry</button>
          </div>
        </div>
      ) : (
        <p>No case sheet data available for this patient.</p>
      )}
    </div>
  );
};

export default CaseSheet;