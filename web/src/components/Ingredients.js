import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';

import DeleteIcon from '../icons/Delete.svg';
import PictureIcon from '../icons/Picture.svg';
import AddIcon from '../icons/Add.svg';

const Ingredients = ({ authToken }) => {
  const [ingredients, setIngredients] = useState([]);
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
        setIngredients(response.data);
      } catch (error) {
        setError('Failed to fetch ingredients');
      }
    };

    fetchUser();
  }, [authToken]);

    const handleAddIngredient = async () => {
    if (newIngredient.trim() !== '') {
      const updatedIngredients = [...ingredients, newIngredient];
      const newFullIngredient = {
        title: newIngredient,
        unitType: 'g',
        image: '',
      };
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      try {
        const response = await axios.post('http://localhost:5000/api/ingredients', newFullIngredient, config);
      } catch (error) {
        console.error(error.response)
      }
      const response = await axios.get('http://localhost:5000/api/ingredients', config);
        setIngredients(response.data);
        setNewIngredient('');
    }
  };

  const handleDeleteIngredient = async (id) => {
    const token = localStorage.getItem('authToken');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        const response = await axios.delete(`http://localhost:5000/api/ingredients/${id}`, config);
    } catch (error) {
        console.error(error.response)
    }
    const response = await axios.get('http://localhost:5000/api/ingredients', config);
    setIngredients(response.data);
  };


  return (
    <div className="user-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h1>{ texts.ingredients }</h1>
      <div className="add-ingredient">
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
        <ul>
            {ingredients.map((ingredient, index) => (
            <li key={index} className="ingredient-item">
                <button className="PictureButton"><img src={PictureIcon} /></button>
                <button className="DeleteButton" onClick={() => handleDeleteIngredient(ingredient._id)}><img src={DeleteIcon} alt={texts.delete} className="delete-icon" /></button>
                {ingredient.title}
            </li>
            ))}
        </ul>
    </div>
  );
};

export default Ingredients;