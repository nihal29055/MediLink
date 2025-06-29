import React, { useState, useEffect } from 'react';

const TreatmentPlanTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', details: '' });
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/medical/treatment-templates'); // Assuming this endpoint exists
      if (!response.ok) {
        throw new Error(`Error fetching templates: ${response.statusText}`);
      }
      const data = await response.json();
      setTemplates(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingTemplate) {
      setEditingTemplate({ ...editingTemplate, [name]: value });
    } else {
      setNewTemplate({ ...newTemplate, [name]: value });
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/medical/treatment-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTemplate),
      });
      if (!response.ok) {
        throw new Error(`Error creating template: ${response.statusText}`);
      }
      setNewTemplate({ name: '', details: '' });
      fetchTemplates(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/medical/treatment-templates/${editingTemplate._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingTemplate),
      });
      if (!response.ok) {
        throw new Error(`Error updating template: ${response.statusText}`);
      }
      setEditingTemplate(null);
      fetchTemplates(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      const response = await fetch(`/api/medical/treatment-templates/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error deleting template: ${response.statusText}`);
      }
      fetchTemplates(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading treatment plan templates...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Treatment Plan Templates</h2>

      {/* Form for creating/editing templates */}
      <form onSubmit={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}>
        <h3>{editingTemplate ? 'Edit Template' : 'Create New Template'}</h3>
        <div>
          <label htmlFor="name">Template Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editingTemplate ? editingTemplate.name : newTemplate.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="details">Treatment Details:</label>
          <textarea
            id="details"
            name="details"
            value={editingTemplate ? editingTemplate.details : newTemplate.details}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit">{editingTemplate ? 'Update Template' : 'Create Template'}</button>
        {editingTemplate && <button onClick={() => setEditingTemplate(null)}>Cancel Edit</button>}
      </form>

      {/* List of templates */}
      <h3>Existing Templates</h3>
      {templates.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        <ul>
          {templates.map((template) => (
            <li key={template._id}>
              <h4>{template.name}</h4>
              <p>{template.details}</p>
              <button onClick={() => setEditingTemplate(template)}>Edit</button>
              <button onClick={() => handleDeleteTemplate(template._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TreatmentPlanTemplates;