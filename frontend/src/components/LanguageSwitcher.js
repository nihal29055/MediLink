import React, { useState } from 'react';

const LanguageSwitcher = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    console.log('Selected language:', newLanguage);
    // Here you would typically call a function to change the application language
    // e.g., using a translation library or context API
  };

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    // Add more languages as needed
  ];

  return (
    <div>
      <label htmlFor="language-select">Select Language:</label>
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={handleLanguageChange}
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;