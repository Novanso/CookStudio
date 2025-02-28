import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './style/RecipeDetails.css'

import EditIcon from '../icons/Edit.svg';
import DeleteIcon from '../icons/Delete.svg';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`, config);
        setRecipe(response.data);
      } catch (error) {
        const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to fetch recipe details';
        setError(errorMessage);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`http://localhost:5000/api/recipes/${id}`, config);
      navigate('/recipes');
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to delete recipe';
      setError(errorMessage);
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!recipe) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div class="recipeHeader">
        <h1>{recipe.name}</h1>
        <button><img src={EditIcon} alt="Edit" className="edit-icon" /></button>
        <button onClick={handleDelete}><img src={DeleteIcon} alt="Delete" className="delete-icon" /></button>
      </div>
      <p>{recipe.instructions}</p>
      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeDetails;