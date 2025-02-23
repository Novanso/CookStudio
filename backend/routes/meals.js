const express = require('express');
const router = express.Router();
const Meal = require('../models/meal');
const auth = require('../middleware/auth');

// Create a meal
router.post('/', auth, async (req, res) => {
    const { date, type, recipe } = req.body;
    const newMeal = new Meal({ date, type, recipe, user: req.user.id });
    try {
        await newMeal.save();
        res.status(201).json(newMeal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// List all meals for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const meals = await Meal.find({ user: req.user.id }).populate('recipe');
        res.json(meals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a meal
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { date, type, recipe } = req.body;
    try {
        const meal = await Meal.findOneAndUpdate({ _id: id, user: req.user.id }, { date, type, recipe }, { new: true }).populate('recipe');
        res.json(meal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a meal
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        await Meal.findOneAndDelete({ _id: id, user: req.user.id });
        res.json({ message: 'Meal deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;