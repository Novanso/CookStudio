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
          <h3>{ texts.account }</h3>
          <div>{ texts.subAccount }</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Preferences')}>
          <h3>{ texts.preferences }</h3>
          <div>{ texts.subPreferences }</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Customization')}>
          <h3>{ texts.customization }</h3>
          <div>{ texts.subCustomization }</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Notifications')}>
          <h3>{ texts.notifications }</h3>
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