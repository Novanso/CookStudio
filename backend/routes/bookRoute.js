const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const auth = require('../middleware/auth');

// List all books for the logged-in user
router.get('/api/books', auth, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.userId }).populate('recipes');
    res.send(books);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a book
router.post('/api/books', auth, async (req, res) => {
  const { title, description, recipes } = req.body;
  const newBook = new Book({ 
    title, 
    description, 
    recipes, 
    user: req.user.userId 
  });
  
  try {
    await newBook.save();
    res.status(201).send(newBook);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a book
router.put('/api/books/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, description, recipes } = req.body;
  try {
    const book = await Book.findOneAndUpdate({ _id: id, user: req.user.userId }, { title, description, recipes }, { new: true }).populate('recipes');
    res.send(book);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a book
router.delete('/api/books/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await Book.findOneAndDelete({ _id: id, user: req.user.userId });
    res.send({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;