const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../web/public/ingredients'));
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

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
router.put('/api/ingredients/:id', auth, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, unitType } = req.body;

  try {
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).send({ error: 'Ingredient not found' });
    }

    if (title) {
      ingredient.title = title;
    }
    if (unitType) {
      ingredient.unitType = unitType;
    }
    if (req.file) {
      ingredient.image = `/ingredients/${req.file.filename}`;
    }

    await ingredient.save();
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