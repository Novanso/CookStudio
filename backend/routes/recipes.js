const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');
const auth = require('../middleware/auth');

// Create a recipe
router.post('/', auth, async (req, res) => {
    const { title, ingredients, steps } = req.body;
    const newRecipe = new Recipe({ title, ingredients, steps, user: req.user.id });
    try {
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// List all recipes for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user.id });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a recipe
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, steps } = req.body;
    try {
        const recipe = await Recipe.findOneAndUpdate({ _id: id, user: req.user.id }, { title, ingredients, steps }, { new: true });
        res.json(recipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a recipe
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        await Recipe.findOneAndDelete({ _id: id, user: req.user.id });
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;