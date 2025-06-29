import React, { useState, useEffect } from 'react';

const DrugDirectory = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMedications, setFilteredMedications] = useState([]);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch('/api/pharmacy/drugs'); // Assuming this is your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMedications(data);
        setFilteredMedications(data); // Initialize filtered list
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  useEffect(() => {
    const results = medications.filter(medication =>
      medication.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedications(results);
  }, [searchTerm, medications]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return <div>Loading medications...</div>;
  }

  if (error) {
    return <div>Error fetching medications: {error.message}</div>;
  }

  return (
    <div>
      <h2>Drug Directory</h2>
      <input
        type="text"
        placeholder="Search medications..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {filteredMedications.length === 0 ? (
        <div>No medications found.</div>
      ) : (
        <ul>
          {filteredMedications.map(medication => (
            <li key={medication._id}>
              <h3>{medication.name}</h3>
              <p>Dosage: {medication.dosage}</p>
              <p>Side Effects: {medication.sideEffects}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DrugDirectory;