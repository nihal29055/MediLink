import React, { useState, useEffect } from 'react';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    appointmentReminders: { email: false, sms: false, whatsapp: false },
    labReportAvailability: { email: false, sms: false, whatsapp: false },
    // Add other notification types here
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Assume an API endpoint to fetch settings: '/api/settings/notifications'
        const response = await fetch('/api/settings/notifications');
        if (!response.ok) {
          throw new Error(`Error fetching settings: ${response.statusText}`);
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = (type, channel) => (event) => {
    setSettings({
      ...settings,
      [type]: {
        ...settings[type],
        [channel]: event.target.checked,
      },
    });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      // Assume an API endpoint to save settings: '/api/settings/notifications'
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        throw new Error(`Error saving settings: ${response.statusText}`);
      }
      setSaveSuccess(true);
      // Optionally refetch settings after saving
      // fetchSettings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading notification settings...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Notification Settings</h2>
      {saveSuccess && <div style={{ color: 'green' }}>Settings saved successfully!</div>}
      {Object.keys(settings).map((type) => (
        <div key={type}>
          <h3>{type.replace(/([A-Z])/g, ' $1').trim()}</h3>
          <div>
            <label>
              <input
                type="checkbox"
                checked={settings[type].email}
                onChange={handleSettingChange(type, 'email')}
              />
              Email
            </label>
            <label style={{ marginLeft: '10px' }}>
              <input
                type="checkbox"
                checked={settings[type].sms}
                onChange={handleSettingChange(type, 'sms')}
              />
              SMS
            </label>
            <label style={{ marginLeft: '10px' }}>
              <input
                type="checkbox"
                checked={settings[type].whatsapp}
                onChange={handleSettingChange(type, 'whatsapp')}
              />
              WhatsApp
            </label>
          </div>
        </div>
      ))}
      <button onClick={handleSaveSettings} disabled={saving}>
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
};

export default NotificationSettings;