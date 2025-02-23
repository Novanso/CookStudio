const mongoose = require('mongoose');

const LivreSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String },
    recettes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recette' }]
});

module.exports = mongoose.model('Livre', LivreSchema);