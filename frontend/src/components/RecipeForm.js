import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecipeForm = ({ fetchRecipes, recipeToEdit, clearEdit, authToken }) => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [id, setId] = useState(null);

    useEffect(() => {
        if (recipeToEdit) {
            setTitle(recipeToEdit.title);
            setIngredients(recipeToEdit.ingredients.join(', '));
            setSteps(recipeToEdit.steps);
            setId(recipeToEdit._id);
        }
    }, [recipeToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recipe = { title, ingredients: ingredients.split(','), steps };

        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };

        if (id) {
            await axios.put(`http://localhost:5000/api/recipes/${id}`, recipe, config);
            clearEdit();
        } else {
            await axios.post('http://localhost:5000/api/recipes', recipe, config);
        }

        fetchRecipes();
        setTitle('');
        setIngredients('');
        setSteps('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
            <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Ingredients (separated by commas)" required />
            <textarea value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="Steps" required></textarea>
            <button type="submit">{id ? 'Edit Recipe' : 'Add Recipe'}</button>
        </form>
    );
};

export default RecipeForm;