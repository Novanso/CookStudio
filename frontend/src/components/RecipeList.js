import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style/RecipeList.css'; // Importer le fichier CSS pour les styles

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

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
        ingredients: [], // Empty ingredients list
        instructions: '', // Empty instructions
      };
      await axios.post('http://localhost:5000/api/recipes', newRecipe, config);
      setSuccess('Recipe added successfully');
      setRecipeName('');
      setError(null);
      setShowForm(false);
      // Refresh the recipe list
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
          <p>Add Recipe</p>
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
            <div className="cut"></div>
            <label htmlFor="name" className="placeholder">Recipe Name</label>
          </div>
            <button type="submit" className="submit">Continue</button>
        </form>
      )}
    </div>
  );
};

export default RecipeList;