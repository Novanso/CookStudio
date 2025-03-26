import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';

const Settings = ({ authToken }) => {
  const { texts, changeLanguage, languages, language } = useContext(LanguageContext);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${authToken}` },
        };
        const response = await axios.get('http://localhost:5000/api/users/me', config);
        if (response.data.displayLanguage) {
          changeLanguage(response.data.displayLanguage);
        }
      } catch (error) {
        setError('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [authToken]);

  const handleLanguageChange = async (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
    try {
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const updatedUser = { displayLanguage: newLanguage };
      const response = await axios.put('http://localhost:5000/api/users/me', updatedUser, config);
      setSuccess(texts.displayLanguageUpdatedSuccessfully);
      setError(null);
    } catch (error) {
      setError(texts.failedUpdateDisplayLanguage);
      setSuccess(null);
    }
  };

  return (
    <div className="settings-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div className="input-container">
        <label htmlFor="displayLanguage" name="selector">{texts.displayLanguage}</label>
        <select
          id="displayLanguage"
          value={language}
          onChange={handleLanguageChange}
        >
          {Object.keys(languages).map((lang) => (
            <option key={lang} value={lang}>
              {languages[lang].name}
            </option>
          ))}
        </select>
        </div>
    </div>
  );
};

export default Settings;