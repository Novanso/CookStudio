import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './style/RecipeDetails.css';

import DeleteIcon from '../icons/Delete.svg';
import AddIcon from '../icons/Add.svg';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [suggestedIngredients, setSuggestedIngredients] = useState([]);
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

    const fetchSuggestedIngredients = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get('http://localhost:5000/api/ingredients', config);
        setSuggestedIngredients(response.data);
      } catch (error) {
        const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to fetch ingredients';
        setError(errorMessage);
      }
    };

    fetchRecipeDetails();
    fetchSuggestedIngredients();
  }, [id]);

  const saveRecipe = async (updatedRecipe) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.put(`http://localhost:5000/api/recipes/${id}`, updatedRecipe, config);
      setRecipe(updatedRecipe);
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to update recipe';
      setError(errorMessage);
    }
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== '') {
      const updatedIngredients = [...ingredients, newIngredient];
      setIngredients(updatedIngredients);
      setNewIngredient('');
      saveRecipe({ ...recipe, ingredients: updatedIngredients });
    }
  };

  const handleDeleteIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
    saveRecipe({ ...recipe, ingredients: updatedIngredients });
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

  const handleTitleChange = (e) => {
    const updatedName = e.target.innerText;
    setName(updatedName);
    saveRecipe({ ...recipe, name: updatedName });
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!recipe) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="recipeHeader">
        <cite contentEditable="true" onBlur={handleTitleChange} suppressContentEditableWarning={true}><h1>{name}</h1></cite>
      </div>
      <p>{recipe.instructions}</p>
      <h2>Ingredients</h2>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index} className="ingredient-item">
            {ingredient}
            <button onClick={() => handleDeleteIngredient(index)}><img src={DeleteIcon} alt="Delete" className="delete-icon" /></button>
          </li>
        ))}
      </ul>
      <div className="add-ingredient">
        <input
          type="text"
          list="suggested-ingredients"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          placeholder="Add new ingredient"
        />
        <datalist id="suggested-ingredients">
          {suggestedIngredients.map((ingredient, index) => (
            <option key={index} value={ingredient} />
          ))}
        </datalist>
        <button onClick={handleAddIngredient}><img src={AddIcon} alt="Add" className="delete-icon" /></button>
      </div>
      <button onClick={handleDelete} className='delete-button'>Delete Recipe</button>
    </div>
  );
};

export default RecipeDetails;