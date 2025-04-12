import React, { useEffect, useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { texts } = useContext(LanguageContext);

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
        const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to fetch recipes';
        setError(errorMessage);
      }
    };

    fetchRecipes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const newRecipe = {
        name: recipeName,
        ingredients: [],
        instructions: '',
      };
      await axios.post('http://localhost:5000/api/recipes', config, newRecipe);
      setSuccess('Recipe added successfully');
      setRecipeName('');
      setError(null);
      setShowForm(false);
      const response = await axios.get('http://localhost:5000/api/recipes', config);
      setRecipes(response.data);
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to add recipe';
      setError(errorMessage);
      setSuccess(null);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div className="recipe-grid">
        <div className="recipe-card add-recipe-card" onClick={() => setShowForm(true)}>
          <p>{ texts.addRecipe }</p>
        </div>
        {recipes.map((recipe) => (
          <div className="recipe-card" key={recipe._id} onClick={() => handleCardClick(recipe._id)}>
            <p className="cardTitle">{recipe.name}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="input-container ic1">
            <input id="name" className="input" type="text" placeholder=" " value={recipeName} onChange={(e) => setRecipeName(e.target.value)} required />
            <div className="cut" style={{ width: (texts.recipeName).length*5+40 }}></div>
            <label htmlFor="name" className="placeholder">{texts.recipeName}</label>
          </div>
          <button type="submit" className="submit">{texts.continue}</button>
        </form>
      )}
    </div>
  );
};

export default RecipeList;