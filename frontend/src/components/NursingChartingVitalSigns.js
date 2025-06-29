import React, { useState, useEffect } from 'react';

const NursingChartingVitalSigns = ({ patientId }) => {
  const [vitalSigns, setVitalSigns] = useState([]);
  const [chartingNotes, setChartingNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newVitalSign, setNewVitalSign] = useState({
    temperature: '',
    pulse: '',
    bloodPressure: '',
    // add other vital signs fields
  });
  const [newChartingNote, setNewChartingNote] = useState('');

  useEffect(() => {
    const fetchVitalSigns = async () => {
      try {
        // Assuming backend endpoints exist for fetching vital signs and charting notes
        const vitalSignsResponse = await fetch(`/api/patients/${patientId}/vitalsigns`);
        if (!vitalSignsResponse.ok) {
          throw new Error('Failed to fetch vital signs');
        }
        const vitalSignsData = await vitalSignsResponse.json();
        setVitalSigns(vitalSignsData);

        const chartingNotesResponse = await fetch(`/api/patients/${patientId}/chartingnotes`);
        if (!chartingNotesResponse.ok) {
          throw new Error('Failed to fetch charting notes');
        }
        const chartingNotesData = await chartingNotesResponse.json();
        setChartingNotes(chartingNotesData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVitalSigns();
  }, [patientId]);

  const handleVitalSignChange = (e) => {
    const { name, value } = e.target;
    setNewVitalSign({ ...newVitalSign, [name]: value });
  };

  const handleChartingNoteChange = (e) => {
    setNewChartingNote(e.target.value);
  };

  const handleSaveVitalSign = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/patients/${patientId}/vitalsigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVitalSign),
      });

      if (!response.ok) {
        throw new Error('Failed to save vital sign');
      }

      const savedVitalSign = await response.json();
      setVitalSigns([...vitalSigns, savedVitalSign]);
      setNewVitalSign({ temperature: '', pulse: '', bloodPressure: '' }); // Reset form
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSaveChartingNote = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/patients/${patientId}/chartingnotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note: newChartingNote }),
      });

      if (!response.ok) {
        throw new Error('Failed to save charting note');
      }

      const savedChartingNote = await response.json();
      setChartingNotes([...chartingNotes, savedChartingNote]);
      setNewChartingNote(''); // Reset form
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading vital signs and charting notes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Nursing Charting and Vital Signs</h2>

      <h3>Record New Vital Signs</h3>
      <form onSubmit={handleSaveVitalSign}>
        <div>
          <label>Temperature:</label>
          <input
            type="text"
            name="temperature"
            value={newVitalSign.temperature}
            onChange={handleVitalSignChange}
          />
        </div>
        <div>
          <label>Pulse:</label>
          <input
            type="text"
            name="pulse"
            value={newVitalSign.pulse}
            onChange={handleVitalSignChange}
          />
        </div>
        <div>
          <label>Blood Pressure:</label>
          <input
            type="text"
            name="bloodPressure"
            value={newVitalSign.bloodPressure}
            onChange={handleVitalSignChange}
          />
        </div>
        {/* Add other vital signs inputs */}
        <button type="submit">Save Vital Sign</button>
      </form>

      <h3>Vital Signs History</h3>
      {vitalSigns.length === 0 ? (
        <p>No vital signs recorded yet.</p>
      ) : (
        <ul>
          {vitalSigns.map((vs) => (
            <li key={vs._id}>
              Date: {new Date(vs.createdAt).toLocaleString()}, Temperature: {vs.temperature}, Pulse: {vs.pulse}, Blood Pressure: {vs.bloodPressure}
              {/* Display other vital signs */}
            </li>
          ))}
        </ul>
      )}

      <h3>Record New Charting Note</h3>
      <form onSubmit={handleSaveChartingNote}>
        <div>
          <label>Charting Note:</label>
          <textarea
            value={newChartingNote}
            onChange={handleChartingNoteChange}
          />
        </div>
        <button type="submit">Save Note</button>
      </form>

      <h3>Charting Notes History</h3>
      {chartingNotes.length === 0 ? (
        <p>No charting notes recorded yet.</p>
      ) : (
        <ul>
          {chartingNotes.map((note) => (
            <li key={note._id}>
              Date: {new Date(note.createdAt).toLocaleString()}: {note.note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NursingChartingVitalSigns;