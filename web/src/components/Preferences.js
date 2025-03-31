import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';

const Preferences = ({ authToken }) => {
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { texts } = useContext(LanguageContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${authToken}` },
        };
        const response = await axios.get('http://localhost:5000/api/users/me', config);
        setUser(response.data);
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
      {user && (
        <div className='user'>
          <h1>Preferences</h1>
          <h2>Calories</h2>
          <h2>Intolerence</h2>
          <div className="allergies-container">
            <h2>Allergies</h2>
            <div className="cards">
              <div className="allergies-card">
                <p className="cardTitle">allergie 1</p>
              </div>
              <div className="allergies-card">
                <p className="cardTitle">allergie 2</p>
              </div>
            </div>
          </div>
        </div> 
      )}
    </div>
  );
};

export default Preferences;