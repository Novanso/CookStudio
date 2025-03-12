const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false, // Not required on creation
  },
  displayLanguage: {
    type: String,
    required: false, // Not required on creation
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;