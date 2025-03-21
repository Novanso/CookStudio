const express = require('express');
const router = express.Router();
const Meal = require('../models/meal');

// Route pour récupérer tous les repas
router.get('/api/meals', async (req, res) => {
  try {
    const meals = await Meal.find();
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meals', error });
  }
});

// Route pour récupérer les repas d'un jour spécifique
router.get('/api/meals/:date', async (req, res) => {
  try {
    const meals = await Meal.findOne({ date: req.params.date });
    if (!meals) {
      return res.status(404).json({ message: 'No meals found for this date' });
    }
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour sauvegarder les repas d'un jour spécifique
router.post('/api/meals/:date', async (req, res) => {
  try {
    const { lunch, dinner } = req.body;
    let meals = await Meal.findOne({ date: req.params.date });

    if (meals) {
      meals.lunch = lunch;
      meals.dinner = dinner;
    } else {
      meals = new Meal({
        date: req.params.date,
        lunch,
        dinner,
      });
    }

    await meals.save();
    res.status(201).json(meals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;