const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  unitType: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Ingredient', ingredientSchema);