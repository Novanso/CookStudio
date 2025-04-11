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
      <div className="SectionLeft">
        <div className='settings-button' onClick={() => handleActivepage(('Account'))}>
          <h2>{ texts.account }</h2>
          <div>{ texts.subAccount }</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Preferences')}>
          <h2>{ texts.preferences }</h2>
          <div>{ texts.subPreferences }</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Customization')}>
          <h2>{ texts.customization }</h2>
          <div>{ texts.subCustomization }</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Notifications')}>
          <h2>{ texts.notifications }</h2>
          <div>{ texts.subNotifications }</div>
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