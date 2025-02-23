const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');

// Create a recipe
router.post('/', async (req, res) => {
    const { title, ingredients, steps } = req.body;
    const newRecipe = new Recipe({ title, ingredients, steps });
    try {
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// List all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a recipe
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, steps } = req.body;
    try {
        const recipe = await Recipe.findByIdAndUpdate(id, { title, ingredients, steps }, { new: true });
        res.json(recipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a recipe
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Recipe.findByIdAndDelete(id);
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;