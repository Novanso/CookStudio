const express = require('express');
const router = express.Router();
const Recette = require('../models/recettes');

// Créer une recette
router.post('/', async (req, res) => {
    const { titre, ingredients, etapes } = req.body;
    const nouvelleRecette = new Recette({ titre, ingredients, etapes });
    try {
        await nouvelleRecette.save();
        res.status(201).json(nouvelleRecette);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lister toutes les recettes
router.get('/', async (req, res) => {
    try {
        const recettes = await Recette.find();
        res.json(recettes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rechercher une recette par titre
router.get('/search', async (req, res) => {
    const { titre } = req.query;
    try {
        const recettes = await Recette.find({ titre: new RegExp(titre, 'i') });
        res.json(recettes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour une recette
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titre, ingredients, etapes } = req.body;
    try {
        const recette = await Recette.findByIdAndUpdate(id, { titre, ingredients, etapes }, { new: true });
        res.json(recette);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer une recette
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Recette.findByIdAndDelete(id);
        res.json({ message: 'Recette supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;