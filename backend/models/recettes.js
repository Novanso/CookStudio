const mongoose = require('mongoose');

const RecetteSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    ingredients: { type: [String], required: true },
    etapes: { type: String, required: true }
});

module.exports = mongoose.model('Recette', RecetteSchema);