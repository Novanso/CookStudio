const express = require('express');
const router = express.Router();
const Meal = require('../models/meal');

// Create a meal
router.post('/', async (req, res) => {
    const { date, type, recipe } = req.body;
    const newMeal = new Meal({ date, type, recipe });
    try {
        await newMeal.save();
        res.status(201).json(newMeal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// List all meals
router.get('/', async (req, res) => {
    try {
        const meals = await Meal.find().populate('recipe');
        res.json(meals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a meal
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { date, type, recipe } = req.body;
    try {
        const meal = await Meal.findByIdAndUpdate(id, { date, type, recipe }, { new: true }).populate('recipe');
        res.json(meal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a meal
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Meal.findByIdAndDelete(id);
        res.json({ message: 'Meal deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;