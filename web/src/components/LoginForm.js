import React, { useState, useContext, useEffect } from 'react';
import PictureIcon from '../icons/Picture.svg'
import addIcon from '../icons/Add.svg'
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [showForm, setShowForm] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { texts } = useContext(LanguageContext);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
    setAccounts(storedAccounts);
    console.log(showForm)
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token, user } = response.data;
      const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
      const realUser = await fetch('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await realUser.json()
      const newAccount = { username: user, profilePicture: data.profilePicture, authToken: token};
      const updatedAccounts = [...accounts.filter(acc => acc.username !== user), newAccount];
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      onLogin(token, user);
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Login failed';
      setError(errorMessage);
    }
  };

  const loginWithToken = async (account) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login-with-token', { token: account.authToken });
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', user);
      navigate('/');
    } catch (error) {
      console.error('Failed to switch account:', error);
    }
  };

  return (
    <div className="login-form">
      {error && <p>{error}</p>}
      {showForm && accounts.map((account) => (
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
      {showForm && (
          <div className="add-account" onClick={()=>setShowForm(!showForm)}>
              <img src={addIcon} />
              <span>{texts.add}</span>
          </div> 
      )}
      {!showForm && (
        <form onSubmit={handleSubmit} id="Login">
        <input
          type="text"
          placeholder={texts.username}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={texts.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{texts.login}</button>
        <button type="cancel"  onClick={()=>setShowForm(!showForm)}>{texts.cancel}</button>
      </form>
      )}
    </div>
  );
};

export default LoginForm;