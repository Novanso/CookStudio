const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../web/public/profiles'));
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

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
router.put('/api/users/me', auth, upload.single('profilePicture'), async (req, res) => {
  const { username, displayLanguage } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    if (username) {
      user.username = username;
    }
    if (displayLanguage) {
      user.displayLanguage = displayLanguage;
    }
    if (req.file) {
      user.profilePicture = `/profiles/${req.file.filename}`;
    }

    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all users profile
router.get('/api/users', auth, async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/api/users/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send({ message: 'User deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;