const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient');
const auth = require('../middleware/auth');

// Create a new ingredient
router.post('/api/ingredients', auth, async (req, res) => {
  const { title, unitType, image } = req.body;
  const newIngredient = new Ingredient({
    title,
    unitType,
    image,
  });
  try {
    await newIngredient.save();
    res.status(201).send(newIngredient);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all ingredients
router.get('/api/ingredients', auth, async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.send(ingredients);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get ingredient by ID
router.get('/api/ingredients/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).send({ error: 'Ingredient not found' });
    }
    res.send(ingredient);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an ingredient by ID
router.put('/api/ingredients/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, unitType, image } = req.body;

  try {
    const ingredient = await Ingredient.findByIdAndUpdate(id, { title, unitType, image }, { new: true });
    if (!ingredient) {
      return res.status(404).send({ error: 'Ingredient not found' });
    }
    res.send(ingredient);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an ingredient by ID
router.delete('/api/ingredients/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const ingredient = await Ingredient.findByIdAndDelete(id);
    if (!ingredient) {
      return res.status(404).send({ error: 'Ingredient not found' });
    }
    res.send({ message: 'Ingredient deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;