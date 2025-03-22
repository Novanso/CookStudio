import React, { useEffect, useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './style/BookDetails.css'

import EditIcon from '../icons/Edit.svg';
import DeleteIcon from '../icons/Delete.svg';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [bookTitle, setBookTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { texts } = useContext(LanguageContext);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(`http://localhost:5000/api/books/${id}`, config);
        const bookData = response.data;
        setBook(bookData);
        setBookTitle(bookData.title);
        setDescription(bookData.description);
        setSelectedRecipes(bookData.recipes.map(recipe => recipe._id));
      } catch (error) {
        const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to fetch book details';
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
    fetchBookDetails();
    fetchRecipes();
  }, [id]);

  const handleRecipeClick = (recipeId) => {
    setSelectedRecipes((prevSelectedRecipes) => {
      if (prevSelectedRecipes.includes(recipeId)) {
        return prevSelectedRecipes.filter((id) => id !== recipeId);
      } else {
        return [...prevSelectedRecipes, recipeId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const updatedBook = {
        title: bookTitle,
        description,
        recipes: selectedRecipes,
      };
      await axios.put(`http://localhost:5000/api/books/${id}`, updatedBook, config);
      setBook({ ...book, ...updatedBook });
      setShowForm(false);
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to update book';
      setError(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`http://localhost:5000/api/books/${id}`, config);
      navigate('/books');
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to delete book';
      setError(errorMessage);
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!book) {
    return <p>{texts.loading}</p>;
  }

  return (
    <div>
      <div className="bookHeader">
        <h1>{book.title}</h1>
        <button onClick={() => setShowForm(true)}><img src={EditIcon} alt="Edit" className="edit-icon" /></button>
        <button onClick={handleDelete}><img src={DeleteIcon} alt="Delete" className="delete-icon" /></button>
      </div>
      <p>{book.description}</p>
      <h2>{texts.recipes}</h2>
        {book.recipes.map(recipe => (
          <div key={recipe._id}>{recipe.name}</div>
        ))}

      {showForm && (
        <form onSubmit={handleSubmit} className="book-form">
          <div className="input-container ic1">
            <input type="text" id="title" className="input" value={bookTitle} placeholder=" " onChange={(e) => setBookTitle(e.target.value)} required/>
            <div className="cut"></div> 
            <label htmlFor="title" className="placeholder">{texts.bookTitle}</label>
          </div>
          <div className="input-container ic2">
            <textarea id="description" className="input" placeholder=" " value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <div className="cut"></div>
            <label htmlFor="description" className="placeholder">{texts.description}</label>
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
            <label htmlFor="recipes" className="placeholder">{texts.recipes}</label>
          </div>
          <div className="buttons">
            <button type="submit" className="submit">{texts.save}</button>
            <button type="button" className="cancel" onClick={() => setShowForm(false)}>{texts.cancel}</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookDetails;
