import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import axios from 'axios';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { texts } = useContext(LanguageContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password });
      setSuccess("Registration successful! You can now log in.");
      setError(null);
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Registration failed';
      setError(errorMessage);
    }
  };

  return (
    <div class="form">
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
      <form onSubmit={handleSubmit} id="Register">
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
        <button type="submit">{texts.register}</button>
      </form>
    </div>
  );
};

export default RegisterForm;