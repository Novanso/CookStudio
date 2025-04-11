import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';

import DeleteIcon from '../icons/Delete.svg';
import AddIcon from '../icons/Add.svg';

const Ingredients = ({ authToken }) => {
  const [ingredients, setIngredients] = useState(null);
  const [newIngredient, setNewIngredient] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { texts } = useContext(LanguageContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${authToken}` },
        };
        const response = await axios.get('http://localhost:5000/api/ingredients', config);
        console.log(response.data)
        setIngredients(response.data);
      } catch (error) {
        setError('Failed to fetch ingredients');
      }
    };

    fetchUser();
  }, [authToken]);

    const handleAddIngredient = () => {
    if (newIngredient.trim() !== '') {
      const updatedIngredients = [...ingredients, newIngredient];
      setIngredients(updatedIngredients);
      setNewIngredient('');
    }
  };

  const handleDeleteIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };


  return (
    <div className="user-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h1>Ingredients</h1>
            <ul>
              {ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  {ingredient}
                  <button onClick={() => handleDeleteIngredient(index)}><img src={DeleteIcon} alt={texts.delete} className="delete-icon" /></button>
                </li>
              ))}
            </ul>
            <div className="add-ingredient ic1">
              <input
                className="input"
                type="text"
                id="ingredient"
                list="suggested-ingredients"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder=" "
              />
              <div className="cut" style={{ width: (texts.ingredientName).length*5+40 }}></div>
              <label htmlFor="ingredient" className="placeholder">{texts.ingredientName}</label>
              <button onClick={handleAddIngredient}><img src={AddIcon} alt={texts.add} className="add-icon" /></button>
            </div>
    </div>
  );
};

export default Ingredients;