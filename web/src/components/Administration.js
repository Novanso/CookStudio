import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';

const Administration = ({ authToken }) => {
  const { texts } = useContext(LanguageContext);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState('Account');

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

  const handleActivepage = (toSet) => {
    setActivePage(toSet)
  };
  
  return (
    <div className="settings-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}   
      <div className="SectionLeft">
        <div className='settings-button' onClick={() => handleActivepage(('Account'))}>
          <h2>Section 1</h2>
          <div>Section 1 description</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Preferences')}>
          <h2>Section 2</h2>
          <div>Section 2 description</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Customization')}>
          <h2>Section 3</h2>
          <div>Section 3 description</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Notifications')}>
          <h2>Section 4</h2>
          <div>Section 4 description</div>
        </div>
      </div>
    </div>
  );
};

export default Administration;