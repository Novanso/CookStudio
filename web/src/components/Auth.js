import React, { useState, useContext, useEffect } from 'react';
import PictureIcon from '../icons/Picture.svg'
import addIcon from '../icons/Add.svg'
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [showLoginForm, setshowLoginForm] = useState(true);
  const [showRegisterForm, setshowRegisterForm] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { texts } = useContext(LanguageContext);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
    setAccounts(storedAccounts);
  }, []);

  const handleLogin = async (e) => {
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

  const handleRegister = async (e) => {
    e.preventDefault();
    const role = "user";
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password, role });
      setSuccess("Registration successful! You can now log in.");
      setError(null);
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Registration failed';
      setError(errorMessage);
    }
  };

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
      if(error.status == 401) {
        setshowLoginForm(!showLoginForm)
        setUsername(account.username)
      } else {
        console.error('Failed to switch account:', error);
      }
    }
  };

  const switchForm = async (account) => {
    if(showLoginForm) { 
      setshowLoginForm(!showLoginForm)
      setshowRegisterForm(!showRegisterForm)
    }
    if(showRegisterForm) { 
      setshowLoginForm(!showLoginForm)
      setshowRegisterForm(!showRegisterForm)
    }
  };

  return (
    <div className="login-form">
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
      {showRegisterForm && showLoginForm && accounts.map((account) => (
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
      {showRegisterForm && showLoginForm && (
          <div className="add-account" onClick={()=>setshowLoginForm(!showLoginForm)}>
              <img src={addIcon} />
              <span>{texts.add}</span>
          </div> 
      )}
      {!showLoginForm && (
        <form onSubmit={handleLogin} id="Login">
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
        <button className='login-button' type="submit">{texts.login}</button>
        <button className='login-button' type="cancel"  onClick={()=>setshowLoginForm(!showLoginForm)}>{texts.cancel}</button>
        <button className='switch-button'  onClick={switchForm}>{texts.register}</button>
      </form>
      )}
      {!showRegisterForm && (
        <form onSubmit={handleRegister} id="Register">
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
        <input
          type="password"
          placeholder={texts.confirmPassword}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className='login-button' type="submit">{texts.register}</button>
        <button className='login-button' type="cancel"  onClick={()=>setshowLoginForm(!showLoginForm)}>{texts.cancel}</button>
        <button className='switch-button'  onClick={switchForm}>{texts.login}</button>
      </form>
      )}
    </div>
  );
};

export default LoginForm;