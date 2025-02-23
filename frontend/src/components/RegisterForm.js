import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, password });
            alert('User registered successfully');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('User already exists');
            } else {
                setError('Registration failed');
            }
            console.error('Registration failed', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Register</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default RegisterForm;