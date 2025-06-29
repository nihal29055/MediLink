import React, { useState, useEffect } from 'react';

const DoctorsNotesList = ({ patientId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorsNotes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/patients/${patientId}/doctorsnotes`); // Assuming this endpoint exists
        if (!response.ok) {
          throw new Error(`Error fetching doctor's notes: ${response.statusText}`);
        }
        const data = await response.json();
        setNotes(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error("Error fetching doctor's notes:", err);
      }
    };

    if (patientId) {
      fetchDoctorsNotes();
    }
  }, [patientId]);

  if (loading) {
    return <div>Loading doctor's notes...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (notes.length === 0) {
    return <div>No doctor's notes found for this patient.</div>;
  }

  return (
    <div>
      <h2>Doctor's Notes</h2>
      <ul>
        {notes.map(note => (
          <li key={note._id}>
            <strong>Date:</strong> {new Date(note.date).toLocaleDateString()} <br />
            <strong>Doctor:</strong> {note.doctor ? note.doctor.name : 'Unknown Doctor'} <br />
            <strong>Note:</strong> {note.content}
            {/* Add functionality to view detail or add new notes here */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorsNotesList;