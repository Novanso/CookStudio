import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookForm = ({ fetchBooks, bookToEdit, clearEdit, authToken }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]); // State pour les recettes
  const [id, setId] = useState(null);

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setDescription(bookToEdit.description);
      setSelectedRecipes(bookToEdit.recipes.map(recipe => recipe._id));
      setId(bookToEdit._id);
    }
  }, [bookToEdit]);

  useEffect(() => {
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

    fetchRecipes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const book = { title, description, recipes: selectedRecipes };

    const config = {
      headers: { Authorization: `Bearer ${authToken}` }
    };

    if (id) {
      await axios.put(`http://localhost:5000/api/books/${id}`, book, config);
      clearEdit();
    } else {
      await axios.post('http://localhost:5000/api/books', book, config);
    }

    fetchBooks();
    setTitle('');
    setDescription('');
    setSelectedRecipes([]);
  };

  const handleRecipeChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedRecipes(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
      <select multiple={true} value={selectedRecipes} onChange={handleRecipeChange}>
        {recipes.map((recipe) => (
          <option key={recipe._id} value={recipe._id}>{recipe.title}</option>
        ))}
      </select>
      <button type="submit">{id ? 'Edit Book' : 'Add Book'}</button>
    </form>
  );
};

export default BookForm;