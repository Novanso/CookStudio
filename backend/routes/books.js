const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Create a book
router.post('/', async (req, res) => {
    const { title, description, recipes } = req.body;
    const newBook = new Book({ title, description, recipes });
    try {
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// List all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().populate('recipes');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a book
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, recipes } = req.body;
    try {
        const book = await Book.findByIdAndUpdate(id, { title, description, recipes }, { new: true }).populate('recipes');
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a book
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findByIdAndDelete(id);
        res.json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;