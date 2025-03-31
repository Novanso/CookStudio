import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import EditPictureIcon from '../icons/EditPicture.svg'
import { LanguageContext } from '../context/LanguageContext';

const Account = ({ authToken }) => {
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { texts, changeLanguage, languages, language } = useContext(LanguageContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${authToken}` },
        };
        const response = await axios.get('http://localhost:5000/api/users/me', config);
        if (response.data.displayLanguage) {
          changeLanguage(response.data.displayLanguage);
        }
        setUser(response.data);
      } catch (error) {
        setError('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [authToken]);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        },
      };
      const response = await axios.put('http://localhost:5000/api/users/me', formData, config);
      setUser(response.data);
      setSuccess(texts.profilePictureUpdatedSuccessfully);
      setError(null);
    } catch (error) {
      setError(texts.failedUpdateProfilePicture);
      setSuccess(null);
    }
  };

  const handleLanguageChange = async (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
    try {
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const updatedUser = { displayLanguage: newLanguage };
      const response = await axios.put('http://localhost:5000/api/users/me', updatedUser, config);
      setSuccess(texts.displayLanguageUpdatedSuccessfully);
      setError(null);
    } catch (error) {
      setError(texts.failedUpdateDisplayLanguage);
      setSuccess(null);
    }
  };

  return (
    <div className="settings-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {user && (
        <div className='user'>
          <div className='user-header'>
            {user.profilePicture && (
              <div className="pfp-edit">
                <label htmlFor="profilePicture">
                  <div className="profile-pic" style={{backgroundImage: 'url(http://localhost:3000/' + user.profilePicture}}>
                    <span>Change Image</span>
                  </div>
                </label>
                <input type="File" accept="image/*" name="profilePicture" id="profilePicture" onChange={handleProfilePictureChange}></input>
              </div>
            )}
            {!user.profilePicture && (
              <div className="pfp-edit">
                <label htmlFor="profilePicture">
                  <div className="profile-pic" style={{backgroundImage: `url(${EditPictureIcon})`}}>
                    <span>Change Image</span>
                  </div>
                </label>
                <input type="File" name="profilePicture" id="profilePicture" onChange={handleProfilePictureChange}></input>
              </div>
            )}
            <h1>{ user.username }</h1>
          </div>
          <div className="input-container">
            <label htmlFor="country" name="selector">Country</label>
            <select id="country" value="country">
              <option>France</option>
              <option>Italia</option>
              <option>UK</option>
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="displayLanguage" name="selector">{texts.displayLanguage}</label>
            <select
              id="displayLanguage"
              value={language}
              onChange={handleLanguageChange}
            >
              {Object.keys(languages).map((lang) => (
                <option key={lang} value={lang}>
                  {languages[lang].name}
                </option>
              ))}
            </select>
          </div>
          <div className="allergies-container">
            <label>Allergies</label>
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

export default Account;