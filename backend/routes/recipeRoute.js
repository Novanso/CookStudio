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

// Get recipe by ID
router.get('/api/recipes/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).send({ error: 'Recipe not found' });
    }
    res.send(recipe);
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

// Update a recipe by ID
router.put('/api/recipes/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, ingredients, instructions } = req.body;

  try {
    const recipe = await Recipe.findByIdAndUpdate(id, { name, ingredients, instructions }, { new: true });
    if (!recipe) {
      return res.status(404).send({ error: 'Recipe not found' });
    }
    res.send(recipe);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a recipe by ID
router.delete('/api/recipes/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) {
      return res.status(404).send({ error: 'Recipe not found' });
    }
    res.send({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;