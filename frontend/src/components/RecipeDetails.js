import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './style/RecipeDetails.css'

import EditIcon from '../icons/Edit.svg';
import DeleteIcon from '../icons/Delete.svg';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [showForm, setShowForm] = useState(false);
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
        const recipeData = response.data;
        setRecipe(recipeData);
        setName(recipeData.name);
        setInstructions(recipeData.instructions);
        setIngredients(recipeData.ingredients);
      } catch (error) {
        const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to fetch recipe details';
        setError(errorMessage);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient('');
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const updatedRecipe = {
        name,
        instructions,
        ingredients,
      };
      await axios.put(`http://localhost:5000/api/recipes/${id}`, updatedRecipe, config);
      setRecipe({ ...recipe, ...updatedRecipe });
      setShowForm(false);
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to update recipe';
      setError(errorMessage);
    }
  };

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
        <button onClick={() => setShowForm(true)}><img src={EditIcon} alt="Edit" className="edit-icon" /></button>
        <button onClick={handleDelete}><img src={DeleteIcon} alt="Delete" className="delete-icon" /></button>
      </div>
      <p>{recipe.instructions}</p>
      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients}
      </ul>

      {showForm && (
        <form onSubmit={handleSubmit} className="recipe-form">
          <div class="input-container ic1">
            <input type="text" id="name" class="input" value={name} placeholder=" " onChange={(e) => setName(e.target.value)} required />
            <div class="cut"></div>
            <label for="name" class="placeholder">Recipe Name</label>
          </div>
          <div class="input-container ic2">
            <textarea id="instructions" class="input" placeholder=" " value={instructions} onChange={(e) => setInstructions(e.target.value)}></textarea>
            <div class="cut"></div>
            <label for="instructions" class="placeholder">Instructions</label>
          </div>
          <div class="input-container ic2">
            <textarea id="ingredients" class="input" placeholder=" " value={ingredients} onChange={(e) => setIngredients(e.target.value)}></textarea>
            <div class="cut"></div>
            <label for="ingredients" class="placeholder">Ingredients</label>
          </div>
          <div class="buttons">
            <button type="submit" class="submit">Update Recipe</button>
            <button type="button" class="cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RecipeDetails;
