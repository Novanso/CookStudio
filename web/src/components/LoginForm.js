import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { texts } = useContext(LanguageContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token, user } = response.data;
      onLogin(token, user);
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Login failed';
      setError(errorMessage);
    }
  };

  return (
    <div class="form">
      {error && <p>{error}</p>}
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
      </form>
    </div>
  );
};

export default LoginForm;