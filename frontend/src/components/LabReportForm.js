import React, { useState, useEffect } from 'react';

const LabReportForm = ({ report }) => {
  const [formData, setFormData] = useState({
    patient: '',
    orderDate: '',
    reportDate: '',
    type: '',
    results: '',
    orderedBy: '',
    approvedBy: '',
    attachments: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (report) {
      setFormData({
        patient: report.patient || '',
        orderDate: report.orderDate ? new Date(report.orderDate).toISOString().split('T')[0] : '',
        reportDate: report.reportDate ? new Date(report.reportDate).toISOString().split('T')[0] : '',
        type: report.type || '',
        results: report.results || '',
        orderedBy: report.orderedBy || '',
        approvedBy: report.approvedBy || '',
        attachments: null, // File inputs are typically uncontrolled or handled differently
      });
    }
  }, [report]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachments') {
      setFormData({ ...formData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!formData.patient || !formData.orderDate || !formData.type || !formData.results || !formData.orderedBy) {
      setError('Required fields are missing.');
      setLoading(false);
      return;
    }

    const url = report ? `/api/reports/lab/${report._id}` : '/api/reports/lab';
    const method = report ? 'PUT' : 'POST';

    // Handle file uploads - create FormData
    const data = new FormData();
    for (const key in formData) {
      if (key === 'attachments' && formData[key]) {
        for (let i = 0; i < formData[key].length; i++) {
          data.append('attachments', formData[key][i]);
        }
      } else if (key !== 'attachments' && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }


    try {
      const response = await fetch(url, {
        method,
        body: data, // Use FormData for file uploads
        // Don't set Content-Type header manually when using FormData
        // headers: {
        //   'Content-Type': 'application/json',
        // },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save lab report');
      }

      const result = await response.json();
      console.log('Lab Report saved:', result);
      setSuccess(true);
      // Optionally clear form or redirect
      if (!report) {
        setFormData({
          patient: '',
          orderDate: '',
          reportDate: '',
          type: '',
          results: '',
          orderedBy: '',
          approvedBy: '',
          attachments: null,
        });
      }
    } catch (err) {
      console.error('Error saving lab report:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{report ? 'Edit Lab Report' : 'Add New Lab Report'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="patient">Patient:</label>
          <input
            type="text"
            id="patient"
            name="patient"
            value={formData.patient}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="orderDate">Order Date:</label>
          <input
            type="date"
            id="orderDate"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="reportDate">Report Date:</label>
          <input
            type="date"
            id="reportDate"
            name="reportDate"
            value={formData.reportDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="type">Report Type:</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="results">Results:</label>
          <textarea
            id="results"
            name="results"
            value={formData.results}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="orderedBy">Ordered By (Doctor ID):</label>
          <input
            type="text"
            id="orderedBy"
            name="orderedBy"
            value={formData.orderedBy}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="approvedBy">Approved By (Doctor ID):</label>
          <input
            type="text"
            id="approvedBy"
            name="approvedBy"
            value={formData.approvedBy}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="attachments">Attachments:</label>
          <input
            type="file"
            id="attachments"
            name="attachments"
            onChange={handleChange}
            multiple
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : report ? 'Update Report' : 'Add Report'}
        </button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>Lab Report saved successfully!</div>}
      </form>
    </div>
  );
};

export default LabReportForm;