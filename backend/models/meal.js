const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: String, enum: ['lunch', 'dinner'], required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Meal', MealSchema);