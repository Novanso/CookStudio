import React, { useEffect, useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const { texts } = useContext(LanguageContext);

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
      const response = await axios.get('http://localhost:5000/api/books', config);
      setBooks(response.data);
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to add book';
      setError(errorMessage);
      setSuccess(null);
    }
  };

  const handleRecipeClick = (recipeId) => {
    setSelectedRecipes((prevSelectedRecipes) => {
      if (prevSelectedRecipes.includes(recipeId)) {
        return prevSelectedRecipes.filter((id) => id !== recipeId);
      } else {
        return [...prevSelectedRecipes, recipeId];
      }
    });
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
          <p>{ texts.addBook }</p>
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
          <div className="input-container ic1">
            <input type="text" id="title" className="input" value={bookTitle} placeholder=" " onChange={(e) => setBookTitle(e.target.value)} required/>
            <div className="cut"></div> 
            <label for="title" className="placeholder">Book Title</label>
          </div>
          <div className="input-container ic2">
            <textarea id="description" className="input" placeholder=" " value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <div className="cut"></div>
            <label for="description" className="placeholder">Description</label>
          </div>
          <div className="input-container ic2" id="select_form">
            <div id="recipes" className="input">
              {recipes.map((recipe) => (
                <div 
                  key={recipe._id} 
                  className={`item ${selectedRecipes.includes(recipe._id) ? 'checked' : ''}`}
                  onClick={() => handleRecipeClick(recipe._id)}
                >
                  <span className="checkbox"><i className="fa-solid fa-check check-icon"></i></span>
                  {recipe.name}
                </div>
              ))}
            </div>
            <div className="cut"></div>
            <label for="recipes" className="placeholder">Recipes</label>
          </div>
          <div className="buttons">
            <button type="submit" className="submit">Add Book</button>
            <button type="button" className="cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookList;
