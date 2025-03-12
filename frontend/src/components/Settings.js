import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/Settings.css';

const Settings = ({ authToken }) => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [displayLanguage, setDisplayLanguage] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${authToken}` },
        };
        const response = await axios.get('http://localhost:5000/api/users/me', config);
        setUser(response.data);
        setProfilePicture(response.data.profilePicture || '');
        setDisplayLanguage(response.data.displayLanguage || '');
      } catch (error) {
        setError('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [authToken]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const updatedUser = {
        profilePicture,
        displayLanguage,
      };
      const response = await axios.put('http://localhost:5000/api/users/me', updatedUser, config);
      setUser(response.data);
      setSuccess('Settings updated successfully');
      setError(null);
    } catch (error) {
      setError('Failed to update settings');
      setSuccess(null);
    }
  };

  return (
    <div className="settings-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSave} className="settings-form">
        <div className="input-container">
          <label htmlFor="profilePicture">Profile Picture URL</label>
          <input
            id="profilePicture"
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="displayLanguage">Display Language</label>
          <input
            id="displayLanguage"
            type="text"
            value={displayLanguage}
            onChange={(e) => setDisplayLanguage(e.target.value)}
          />
        </div>
        <button type="submit" className="save-btn">Save</button>
      </form>
    </div>
  );
};

export default Settings;