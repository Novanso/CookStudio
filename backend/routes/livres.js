const express = require('express');
const router = express.Router();
const Livre = require('../models/livre');

// Créer un livre de recettes
router.post('/', async (req, res) => {
    const { titre, description, recettes } = req.body;
    const nouveauLivre = new Livre({ titre, description, recettes });
    try {
        await nouveauLivre.save();
        res.status(201).json(nouveauLivre);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lister tous les livres de recettes
router.get('/', async (req, res) => {
    try {
        const livres = await Livre.find().populate('recettes');
        res.json(livres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour un livre de recettes
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titre, description, recettes } = req.body;
    try {
        const livre = await Livre.findByIdAndUpdate(id, { titre, description, recettes }, { new: true }).populate('recettes');
        res.json(livre);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un livre de recettes
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Livre.findByIdAndDelete(id);
        res.json({ message: 'Livre de recettes supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;