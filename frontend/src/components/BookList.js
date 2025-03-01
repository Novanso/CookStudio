import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style/BookList.css'; // Importer le fichier CSS pour les styles

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [bookTitle, setBookTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

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

  const handleCardClick = (id) => {
    navigate(`/books/${id}`);
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
          <div className="book-card" key={book._id} onClick={() => handleCardClick(book._id)}>
            <p>{book.title}</p>
          </div>
        ))}
      </div>
      <link rel="stylesheet" href="https:\\cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"></link>

      {showForm && (
        <form onSubmit={handleSubmit} className="book-form">
          <div class="input-container ic1">
            <input type="text" id="title" class="input" value={bookTitle} placeholder=" " onChange={(e) => setBookTitle(e.target.value)} required/>
            <div class="cut"></div> 
            <label for="title" class="placeholder">Book Title</label>
          </div>
          <div class="input-container ic2">
            <textarea id="description" class="input" placeholder=" " value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <div class="cut"></div>
            <label for="description" class="placeholder">Description</label>
          </div>
          <div class="input-container ic2" id="select_form">
            <select id="recipes" multiple="multiple" placeholder=" " class="input" value={selectedRecipes} onChange={handleRecipeChange}>
              {recipes.map((recipe) => (
                <option type="checkbox" class="item" key={recipe._id} value={recipe._id}>
                  <span class="checkbox"><i class="fa-solid fa-check check-icon"></i></span>
                  <label>{recipe.name}</label>
                </option>
              ))}
            </select>
            <div class="cut"></div>
            <label for="recipes" class="placeholder">Recipes</label>
          </div>
          <div class="buttons">
            <button type="submit" class="submit">Add Book</button>
            <button type="button" class="cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookList;