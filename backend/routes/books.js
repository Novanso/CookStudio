const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const auth = require('../middleware/auth');

// Create a book
router.post('/', auth, async (req, res) => {
    const { title, description, recipes } = req.body;
    const newBook = new Book({ title, description, recipes, user: req.user.id });
    try {
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// List all books for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user.id }).populate('recipes');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a book
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { title, description, recipes } = req.body;
    try {
        const book = await Book.findOneAndUpdate({ _id: id, user: req.user.id }, { title, description, recipes }, { new: true }).populate('recipes');
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a book
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findOneAndDelete({ _id: id, user: req.user.id });
        res.json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;