import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BookList = ({ authToken }) => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [id, setId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchBooks = useCallback(async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const response = await axios.get('http://localhost:5000/api/books', config);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Error fetching books');
    }
  }, [authToken]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${authToken}` },
        };
        const response = await axios.get('http://localhost:5000/api/recipes', config);
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [authToken]);

  const handleAddBook = () => {
    setShowForm(true);
    setId(null);
    setTitle('');
    setDescription('');
    setSelectedRecipes([]);
  };

  const handleEditBook = (book) => {
    setShowForm(true);
    setId(book._id);
    setTitle(book.title);
    setDescription(book.description);
    setSelectedRecipes(book.recipes.map(recipe => recipe._id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const book = { title, description, recipes: selectedRecipes };

    const config = {
      headers: { Authorization: `Bearer ${authToken}` }
    };

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/books/${id}`, book, config);
        setSuccess('Book updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/books', book, config);
        setSuccess('Book added successfully');
      }
      fetchBooks();
      setShowForm(false);
      setTitle('');
      setDescription('');
      setSelectedRecipes([]);
      setError(null);
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to save book';
      setError(errorMessage);
      setSuccess(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setTitle('');
    setDescription('');
    setSelectedRecipes([]);
    setError(null);
    setSuccess(null);
  };

  const handleRecipeChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedRecipes(value);
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div className="book-grid">
        <div className="book-card add-book-card" onClick={handleAddBook}>
          <p>Add Book</p>
        </div>
        {books.map((book) => (
          <div className="book-card" key={book._id} onClick={() => handleEditBook(book)}>
            <p>{book.title}</p>
          </div>
        ))}
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="book-form">
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label>Recipes:</label>
            <select multiple={true} value={selectedRecipes} onChange={handleRecipeChange}>
              {recipes.map((recipe) => (
                <option key={recipe._id} value={recipe._id}>{recipe.title}</option>
              ))}
            </select>
          </div>
          <button type="submit">{id ? 'Edit Book' : 'Add Book'}</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default BookList;