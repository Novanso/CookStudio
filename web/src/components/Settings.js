import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';
import Profile from './Profile';

const Settings = ({ authToken }) => {
  const { texts } = useContext(LanguageContext);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${authToken}` },
        };
        const response = await axios.get('http://localhost:5000/api/users/me', config);
      } catch (error) {
        setError('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [authToken]);


  return (
    <div className="settings-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}   
      <div class="SectionLeft">Section Left</div>
      <div class="SectionRight">
        <Profile authToken={authToken} />
      </div> 
    </div>
  );
};

export default Settings;