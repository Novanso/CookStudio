import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/Settings.css';

const Settings = ({ authToken }) => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
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
        setDisplayLanguage(response.data.displayLanguage || '');
      } catch (error) {
        setError('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [authToken]);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('displayLanguage', displayLanguage);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        },
      };
      const response = await axios.put('http://localhost:5000/api/users/me', formData, config);
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
      {user && user.profilePicture && (
        <div className="profile-picture-preview">
          <img src={user.profilePicture} alt="Profile" />
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSave} className="settings-form">
        <div className="input-container">
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
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