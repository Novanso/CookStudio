const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const auth = require('../middleware/auth');

router.get('/api/recipes', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.send(recipes);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/api/recipes', auth, async (req, res) => {
  const { name, ingredients, instructions } = req.body;
  const recipe = new Recipe({
    name,
    ingredients,
    instructions,
  });

  try {
    await recipe.save();
    res.status(201).send(recipe);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;