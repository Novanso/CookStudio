import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';

import Ingredients from './Ingredients';

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
      <div className="SectionLeft">
        <div className='settings-button' onClick={() => handleActivepage(('User'))}>
        <div>{ texts.user }</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Tags')}>
          <div>Handle Tags</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Categories')}>
          <div>Handle Categories</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('External')}>
          <div>External Access</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Ingredients')}>
          <div>{ texts.ingredients }</div>
        </div>
        <div className='settings-button' onClick={() => handleActivepage('Statistics')}>
          <div>{ texts.stats }</div>
        </div>
      </div>
      <div className="SectionRight"> 
        { activePage === 'Ingredients' && (
            <Ingredients authToken={authToken} />
          ) }
      </div>
    </div>
  );
};

export default Administration;