import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PictureIcon from '../icons/Picture.svg'
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
    setAccounts(storedAccounts);
  }, []);
  
  const loginWithToken = async (account) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login-with-token', { token: account.authToken });
      const { token, user } = response.data;
      const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
      const realUser = await fetch('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await realUser.json()
      const newAccount = { username: user, profilePicture: data.profilePicture, authToken: token};
      const updatedAccounts = [...accounts.filter(acc => acc.username !== user), newAccount];
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', user);
      navigate('/');
    } catch (error) {
      console.error('Failed to switch account:', error);
    }
  };

  return (
    <div className="switch-account">
      {accounts.map((account) => (
        <div key={account.id} className="account" onClick={() => loginWithToken(account)}>
          { account.profilePicture && (
            <img src={account.profilePicture} alt={account.username} />
          )}
          { !account.profilePicture && (
            <img src={PictureIcon} alt={account.username} />
          )}
          <span>{account.username}</span>
        </div>
      ))}
    </div>
  );
};

export default Profile;