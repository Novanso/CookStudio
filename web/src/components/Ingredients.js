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
        setSuccess('Ingredient Added Successfully !')
      } catch (error) {
        console.error(error.response)
      }
      const response = await axios.get('http://localhost:5000/api/ingredients', config);
        setIngredients(response.data);
        setNewIngredient('');
    }
  };

  const handleChangeUnit = async (e) => {
    const NewUnit = e.target.value;
    const updatedIngredient = { unitType: NewUnit };
    const token = localStorage.getItem('authToken');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
      const response = await axios.put(`http://localhost:5000/api/ingredients/${e.target.id}`, updatedIngredient, config);
      setSuccess('Ingredient Edited Successfully !')
    } catch (error) {
        console.error(error.response)
    }
    const response = await axios.get('http://localhost:5000/api/ingredients', config);
    setIngredients(response.data);
  };

  const handleDeleteIngredient = async (id) => {
    const token = localStorage.getItem('authToken');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        const response = await axios.delete(`http://localhost:5000/api/ingredients/${id}`, config);
        setSuccess('Ingredient Deleted Successfully !')
    } catch (error) {
        console.error(error.response)
    }
    const response = await axios.get('http://localhost:5000/api/ingredients', config);
    setIngredients(response.data);
  };


  return (
    <div className="ingredients-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <h1>{ texts.ingredients }</h1>
      <div className="addIngredient">
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
        <ul className="ingredients">
            {ingredients.map((ingredient, index) => (
            <li key={index} className="ingredient">
                {ingredient.title}
                <div className='actionButtons'>
                  <select id={ingredient._id} value={ingredient.unitType} className='unitTypeSelect' onChange={handleChangeUnit}>
                    <option>aucun</option>
                    <option>g</option>
                    <option>L</option>
                  </select>
                  <button className="PictureButton"><img src={PictureIcon} /></button>
                  <button className="DeleteButton" onClick={() => handleDeleteIngredient(ingredient._id)}><img src={DeleteIcon} alt={texts.delete} className="delete-icon" /></button>
                </div>
            </li>
            ))}
        </ul>
    </div>
  );
};

export default Ingredients;