import React, { useState } from 'react';
import axios from 'axios';
import './style/Login_Register_Form.css'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

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
    <div class="Form">
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit} id="Login">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;