const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  lunch: {
    type: String,
    default: '',
  },
  dinner: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('meal', mealSchema);