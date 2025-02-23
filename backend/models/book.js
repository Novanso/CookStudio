const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Book', BookSchema);