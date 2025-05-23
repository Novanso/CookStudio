import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';
import { ToastContainer, toast } from 'react-toastify';

import DeleteIcon from '../icons/Delete.svg';
import EditPictureIcon from '../icons/EditPicture.svg';
import PictureIcon from '../icons/Picture.svg';
import AddIcon from '../icons/Add.svg';



const Ingredients = ({ authToken }) => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
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
        toast.error('Failed to fetch Ingredient',{position: "bottom-right",theme: "dark",pauseOnHover: false});
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
        const add = await axios.post('http://localhost:5000/api/ingredients', newFullIngredient, config);
        toast.success('Ingredient Added Successfully !',{position: "bottom-right",theme: "dark",pauseOnHover: false});
      } catch (error) {
        toast.error('Failed to delete Ingredient',{position: "bottom-right",theme: "dark",pauseOnHover: false});
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
      const update = await axios.put(`http://localhost:5000/api/ingredients/${e.target.parentNode.id}`, updatedIngredient, config);
      toast.success('Ingredient Updated Successfully !',{position: "bottom-right",theme: "dark",pauseOnHover: false});
    } catch (error) {
      toast.error('Failed to update Ingredient',{position: "bottom-right",theme: "dark",pauseOnHover: false});
    }
    const response = await axios.get('http://localhost:5000/api/ingredients', config);
    setIngredients(response.data);
  };

  const handlePicture = async (e) => {
    const ingredientID = e.target.parentNode.id;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        },
      };
      const response = await axios.put(`http://localhost:5000/api/ingredients/${ingredientID}`, formData, config);
      toast.success('Ingredient Updated Successfully !',{position: "bottom-right",theme: "dark",pauseOnHover: false});
    } catch (error) {
      toast.error('Failed to update Ingredient',{position: "bottom-right",theme: "dark",pauseOnHover: false});
    }
  };

  const handleDeleteIngredient = async (id) => {
    const token = localStorage.getItem('authToken');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
        const response = await axios.delete(`http://localhost:5000/api/ingredients/${id}`, config);
        toast.success('Ingredient Successfully Deleted !',{position: "bottom-right",theme: "dark",pauseOnHover: false});
    } catch (error) {
      toast.error('Failed to delete Ingredient',{position: "bottom-right",theme: "dark",pauseOnHover: false});
    }
    const response = await axios.get('http://localhost:5000/api/ingredients', config);
    setIngredients(response.data);
  };


  return (
    <div className="ingredients-container">
      <ToastContainer />
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
            <li key={ingredient._id} className="ingredient-li">
                <div className='ingredient' id={ingredient._id}>
                {ingredient.image && (
                  <img src={'http://localhost:3000/' + ingredient.image} />
                )}
                {!ingredient.image && (
                  <img src={PictureIcon} />
                )}
                  {ingredient.title}
                </div>
                <div className='ingredientsActionButtons' id={ingredient._id}>
                  <select key={ingredient._id} value={ingredient.unitType} className='unitTypeSelect' onChange={handleChangeUnit}>
                    <option>nb</option>
                    <option>g</option>
                    <option>L</option>
                  </select>
                  <label className="PictureButton" htmlFor={'input_' + ingredient._id}><img src={EditPictureIcon} /></label>
                  <input type="File" id={'input_' + ingredient._id} onChange={handlePicture}></input>
                  <button className="DeleteButton" onClick={() => handleDeleteIngredient(ingredient._id)}><img src={DeleteIcon} alt={texts.delete} className="delete-icon" /></button>
                </div>
            </li>
            ))}
        </ul>
    </div>
  );
};

export default Ingredients;