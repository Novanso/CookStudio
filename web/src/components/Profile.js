import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';
import './style/Settings.css';

const Profile = ({ authToken }) => {
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

  return (
    <div className="settings-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {user && (
        <div className='user'>
          {user.profilePicture && (
            <div className="pfp-edit">
              <label htmlFor="profilePicture">
                <div class="profile-pic" style={{backgroundImage: 'url(http://localhost:3000/' + user.profilePicture}}>
                  <span>Change Image</span>
                </div>
              </label>
              <input type="File" accept="image/*" name="profilePicture" id="profilePicture" onChange={handleProfilePictureChange}></input>
            </div>
          )}
          {!user.profilePicture && (
            <div className="pfp-edit">
              <label htmlFor="profilePicture">
                <div class="profile-pic" style={{backgroundImage: 'url(http://localhost:3000/'}}>
                  <span>Change Image</span>
                </div>
              </label>
              <input type="File" name="profilePicture" id="profilePicture" onChange={handleProfilePictureChange}></input>
            </div>
          )}
          <h1>{ user.username }</h1>
        </div> 
      )}
    </div>
  );
};

export default Profile;