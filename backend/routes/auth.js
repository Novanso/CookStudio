const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log('Register request received with:', { username, password });
    if (!username || !password) {
        console.log('Validation failed: Username and password are required');
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({ username, password });
        console.log('Creating new user:', newUser);
        await newUser.save();
        console.log('User registered successfully');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: error.message });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token, user: { username: user.username } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;