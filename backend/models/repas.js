const mongoose = require('mongoose');

const RepasSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: String, enum: ['midi', 'soir'], required: true },
    recette: { type: mongoose.Schema.Types.ObjectId, ref: 'Recette', required: true }
});

module.exports = mongoose.model('Repas', RepasSchema);