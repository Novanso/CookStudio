const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

// Get user profile
router.get('/api/users/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update user profile
router.put('/api/users/me', auth, async (req, res) => {
  const { username, profilePicture, displayLanguage } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    if (username) {
      user.username = username;
    }
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }
    if (displayLanguage) {
      user.displayLanguage = displayLanguage;
    }

    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;