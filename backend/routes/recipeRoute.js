const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const auth = require('../middleware/auth');

// List all recipes for the logged-in user
router.get('/api/recipes', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.userId });
    res.send(recipes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a recipe
router.post('/api/recipes', auth, async (req, res) => {
  const { name, ingredients, instructions } = req.body;
  const newRecipe = new Recipe({
    name,
    ingredients,
    instructions,
    user: req.user.userId
  });
  try {
    await newRecipe.save();
    res.status(201).send(newRecipe);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;