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
    required: false,
  },
  role: {
    type: String,
    required: false,
  },
  displayLanguage: {
    type: String,
    required: false,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;