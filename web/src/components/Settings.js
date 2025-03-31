import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';
import Account from './Account';
import Preferences from './Preferences';
import Notifications from './Notifications';
import Customization from './Customization';

const Settings = ({ authToken }) => {
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
          <h2>Account</h2>
          <div>Edit your profile and account</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Preferences')}>
          <h2>Preferences</h2>
          <div>Select your preferences about food</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Customization')}>
          <h2>Customization</h2>
          <div>Set your visual preferences for the app</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Notifications')}>
          <h2>Notifications</h2>
          <div>Customize how you're notified</div>
        </div>
      </div>
      <div className="SectionRight"> 
        { activePage === 'Account' && (
          <Account authToken={authToken} />
        ) }
        { activePage === 'Preferences' && (
          <Preferences authToken={authToken} />
        ) }
        { activePage === 'Notifications' && (
          <Notifications authToken={authToken} />
        ) }
        { activePage === 'Customization' && (
          <Customization authToken={authToken} />
        ) }
      </div> 
    </div>
  );
};

export default Settings;