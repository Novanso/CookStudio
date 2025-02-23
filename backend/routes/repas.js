const express = require('express');
const router = express.Router();
const Repas = require('../models/repas');

// Créer un repas
router.post('/', async (req, res) => {
    const { date, type, recette } = req.body;
    const nouveauRepas = new Repas({ date, type, recette });
    try {
        await nouveauRepas.save();
        res.status(201).json(nouveauRepas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lister tous les repas
router.get('/', async (req, res) => {
    try {
        const repas = await Repas.find().populate('recette');
        res.json(repas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour un repas
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { date, type, recette } = req.body;
    try {
        const repas = await Repas.findByIdAndUpdate(id, { date, type, recette }, { new: true }).populate('recette');
        res.json(repas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un repas
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Repas.findByIdAndDelete(id);
        res.json({ message: 'Repas supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;