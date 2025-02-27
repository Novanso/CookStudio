import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookList.css'; // Importer le fichier CSS pour les styles

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [bookTitle, setBookTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get('http://localhost:5000/api/books', config);
        setBooks(response.data);
      } catch (error) {
        const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to fetch books';
        setError(errorMessage);
      }
    };

    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get('http://localhost:5000/api/recipes', config);
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchBooks();
    fetchRecipes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const newBook = {
        title: bookTitle,
        description,
        recipes: selectedRecipes,
      };
      await axios.post('http://localhost:5000/api/books', newBook, config);
      setSuccess('Book added successfully');
      setBookTitle('');
      setDescription('');
      setSelectedRecipes([]);
      setError(null);
      setShowForm(false);
      // Refresh the book list
      const response = await axios.get('http://localhost:5000/api/books', config);
      setBooks(response.data);
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to add book';
      setError(errorMessage);
      setSuccess(null);
    }
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
        <div className="book-card add-book-card" onClick={() => setShowForm(true)}>
          <p>Add Book</p>
        </div>
        {books.map((book) => (
          <div className="book-card" key={book._id}>
            <p>{book.title}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="book-form">
          <div>
            <label>Book Title:</label>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
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
                <option key={recipe._id} value={recipe._id}>{recipe.name}</option>
              ))}
            </select>
          </div>
          <button type="submit">Add Book</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default BookList;