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
  }, [authToken]);

  const handleActivepage = (toSet) => {
    setActivePage(toSet)
  }

  function Page({ name, isActive }) {
  return (
    <div id={{name}} onClick={() => handleActivepage(name)} className={isActive ? 'active-admin-button' : 'admin-button'}>
      { name === 'users' && <div>{ texts.users }</div>}
      { name === 'tags' && <div>Handle Tags</div>}
      { name === 'categories' && <div>Handle Categories</div>}
      { name === 'external' && <div>External Access</div>}
      { name === 'ingredients' && <div>{ texts.ingredients }</div>}
      { name === 'statistics' && <div>{ texts.stats }</div>}
    </div>
  );
}  
  return (
    <div className="settings-container"> 
      <div className="SectionLeft">
        <Page isActive={activePage === 'users' && true} name="users"></Page>
        <Page isActive={activePage === 'tags' && true} name="tags"></Page>
        <Page isActive={activePage === 'categories' && true} name="categories"></Page>
        <Page isActive={activePage === 'external' && true} name="external"></Page>
        <Page isActive={activePage === 'ingredients' && true} name="ingredients"></Page>
        <Page isActive={activePage === 'statistics' && true} name="statistics"></Page>
      </div>
      <div className="SectionRight"> 
        { activePage === 'users' && (
          <Users authToken={authToken} />
        ) }
        { activePage === 'ingredients' && (
            <Ingredients authToken={authToken} />
        ) }
      </div>
    </div>
  );
};

export default Administration;