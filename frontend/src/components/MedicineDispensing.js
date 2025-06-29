import React, { useState, useEffect } from 'react';

const MedicineDispensing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [dispensingData, setDispensingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to search for prescriptions or patients
  useEffect(() => {
    if (searchTerm.length > 2) {
      setLoading(true);
      setError(null);
      // Assuming a backend endpoint for searching prescriptions/patients
      fetch(`/api/pharmacy/search?q=${searchTerm}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(data => {
          setSearchResults(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSelectPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    // Initialize dispensing data based on prescription items
    if (prescription && prescription.medications) {
      setDispensingData(prescription.medications.map(med => ({
        medicationId: med.medicationId,
        name: med.name,
        prescribedQuantity: med.quantity,
        dispensedQuantity: 0,
        dispensingDate: new Date().toISOString().split('T')[0], // Default to today
      })));
    } else {
      setDispensingData([]);
    }
    setSearchTerm(''); // Clear search
    setSearchResults([]);
  };

  const handleDispensedQuantityChange = (index, quantity) => {
    const newDispensingData = [...dispensingData];
    newDispensingData[index].dispensedQuantity = parseInt(quantity, 10) || 0;
    setDispensingData(newDispensingData);
  };

  const handleSubmitDispensing = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pharmacy/dispense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prescriptionId: selectedPrescription._id,
          dispensingItems: dispensingData.map(item => ({
            medicationId: item.medicationId,
            dispensedQuantity: item.dispensedQuantity,
            dispensingDate: item.dispensingDate,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record dispensing');
      }

      const result = await response.json();
      console.log('Dispensing recorded successfully:', result);
      // Reset form after successful submission
      setSelectedPrescription(null);
      setDispensingData([]);
    } catch (err) {
      setError(err);
      console.error('Error recording dispensing:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Medicine Dispensing</h2>
      <div>
        <input
          type="text"
          placeholder="Search patient or prescription..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && <p>Loading search results...</p>}
        {error && <p>Error searching: {error.message}</p>}
        {searchResults.length > 0 && (
          <ul>
            {searchResults.map(result => (
              <li key={result._id} onClick={() => handleSelectPrescription(result)}>
                {/* Display relevant info based on search result type */}
                {result.type === 'prescription' ?
                 `Prescription for ${result.patientName} by Dr. ${result.doctorName}` :
                 `Patient: ${result.name} (${result._id})`
                }
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedPrescription && (
        <div>
          <h3>Prescription Details</h3>
          <p>Patient: {selectedPrescription.patientName}</p>
          <p>Doctor: {selectedPrescription.doctorName}</p>
          <h4>Medications:</h4>
          <table>
            <thead>
              <tr>
                <th>Medication</th>
                <th>Prescribed Quantity</th>
                <th>Dispensed Quantity</th>
                <th>Dispensing Date</th>
              </tr>
            </thead>
            <tbody>
              {dispensingData.map((item, index) => (
                <tr key={item.medicationId}>
                  <td>{item.name}</td>
                  <td>{item.prescribedQuantity}</td>
                  <td>
                    <input
                      type="number"
                      value={item.dispensedQuantity}
                      onChange={(e) => handleDispensedQuantityChange(index, e.target.value)}
                      min="0"
                      max={item.prescribedQuantity}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={item.dispensingDate}
                      onChange={(e) => {
                        const newDispensingData = [...dispensingData];
                        newDispensingData[index].dispensingDate = e.target.value;
                        setDispensingData(newDispensingData);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmitDispensing} disabled={loading}>
            {loading ? 'Recording...' : 'Record Dispensing'}
          </button>
          {error && <p>Error recording dispensing: {error.message}</p>}
        </div>
      )}
    </div>
  );
};

export default MedicineDispensing;