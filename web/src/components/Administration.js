import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';

import Ingredients from './Ingredients';
import Users from './Users';

import './style/Administration.css'

const Administration = ({ authToken }) => {
  const { texts } = useContext(LanguageContext);
  const [activePage, setActivePage] = useState('Users');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${authToken}` },
        };
        const response = await axios.get('http://localhost:5000/api/users/me', config);
      } catch (error) {
        console.log(error)
      }
    };
    fetchUser();
    document.getElementById('userstitle').style.setProperty("background-color", "var(--dark-tertiary)");
  }, [authToken]);

  const handleActivepage = (toSet) => {
    setActivePage(toSet)
    switch(toSet) {
      case 'Users':
        document.getElementById('userstitle').style.setProperty("background-color", "var(--dark-tertiary)")
        document.getElementById('tagstitle').style.setProperty("background-color", "inherit")
        document.getElementById('catagoriestitle').style.setProperty("background-color", "inherit")
        document.getElementById('externaltitle').style.setProperty("background-color", "inherit")
        document.getElementById('ingredientstitle').style.setProperty("background-color", "inherit")
        document.getElementById('statisticstitle').style.setProperty("background-color", "inherit")
        break;
      case 'Tags':
        document.getElementById('userstitle').style.setProperty("background-color", "inherit")
        document.getElementById('tagstitle').style.setProperty("background-color", "var(--dark-tertiary)")
        document.getElementById('catagoriestitle').style.setProperty("background-color", "inherit")
        document.getElementById('externaltitle').style.setProperty("background-color", "inherit")
        document.getElementById('ingredientstitle').style.setProperty("background-color", "inherit")
        document.getElementById('statisticstitle').style.setProperty("background-color", "inherit")
        break;
      case 'Categories':
        document.getElementById('userstitle').style.setProperty("background-color", "inherit")
        document.getElementById('tagstitle').style.setProperty("background-color", "inherit")
        document.getElementById('catagoriestitle').style.setProperty("background-color", "var(--dark-tertiary)")
        document.getElementById('externaltitle').style.setProperty("background-color", "inherit")
        document.getElementById('ingredientstitle').style.setProperty("background-color", "inherit")
        document.getElementById('statisticstitle').style.setProperty("background-color", "inherit")
        break;
      case 'External':
        document.getElementById('userstitle').style.setProperty("background-color", "inherit")
        document.getElementById('tagstitle').style.setProperty("background-color", "inherit")
        document.getElementById('catagoriestitle').style.setProperty("background-color", "inherit")
        document.getElementById('externaltitle').style.setProperty("background-color", "var(--dark-tertiary)")
        document.getElementById('ingredientstitle').style.setProperty("background-color", "inherit")
        document.getElementById('statisticstitle').style.setProperty("background-color", "inherit")
        break;
      case 'Ingredients':
        document.getElementById('userstitle').style.setProperty("background-color", "inherit")
        document.getElementById('tagstitle').style.setProperty("background-color", "inherit")
        document.getElementById('catagoriestitle').style.setProperty("background-color", "inherit")
        document.getElementById('externaltitle').style.setProperty("background-color", "inherit")
        document.getElementById('ingredientstitle').style.setProperty("background-color", "var(--dark-tertiary)")
        document.getElementById('statisticstitle').style.setProperty("background-color", "inherit")
        break;
      case 'Statistics':
        document.getElementById('userstitle').style.setProperty("background-color", "inherit")
        document.getElementById('tagstitle').style.setProperty("background-color", "inherit")
        document.getElementById('catagoriestitle').style.setProperty("background-color", "inherit")
        document.getElementById('externaltitle').style.setProperty("background-color", "inherit")
        document.getElementById('ingredientstitle').style.setProperty("background-color", "inherit")
        document.getElementById('statisticstitle').style.setProperty("background-color", "var(--dark-tertiary)")
        break;
    }
  };
  
  return (
    <div className="settings-container"> 
      <div className="SectionLeft">
        <div className='settings-button' id='userstitle' onClick={() => handleActivepage(('Users'))}>
        <div>{ texts.users }</div>
        </div>
        <div className='settings-button' id='tagstitle' onClick={() => handleActivepage('Tags')}>
          <div>Handle Tags</div>
        </div>
        <div className='settings-button' id='catagoriestitle' onClick={() => handleActivepage('Categories')}>
          <div>Handle Categories</div>
        </div>
        <div className='settings-button' id='externaltitle' onClick={() => handleActivepage('External')}>
          <div>External Access</div>
        </div>
        <div className='settings-button' id='ingredientstitle' onClick={() => handleActivepage('Ingredients')}>
          <div>{ texts.ingredients }</div>
        </div>
        <div className='settings-button' id='statisticstitle' onClick={() => handleActivepage('Statistics')}>
          <div>{ texts.stats }</div>
        </div>
      </div>
      <div className="SectionRight"> 
        { activePage === 'Ingredients' && (
            <Ingredients authToken={authToken} />
        ) }
        { activePage === 'Users' && (
          <Users authToken={authToken} />
        ) }
      </div>
    </div>
  );
};

export default Administration;