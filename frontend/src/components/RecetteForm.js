import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecetteForm = ({ fetchRecettes, recetteToEdit, clearEdit }) => {
    const [titre, setTitre] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [etapes, setEtapes] = useState('');
    const [id, setId] = useState(null);

    useEffect(() => {
        if (recetteToEdit) {
            setTitre(recetteToEdit.titre);
            setIngredients(recetteToEdit.ingredients.join(', '));
            setEtapes(recetteToEdit.etapes);
            setId(recetteToEdit._id);
        }
    }, [recetteToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recette = { titre, ingredients: ingredients.split(','), etapes };

        if (id) {
            await axios.put(`http://localhost:5000/api/recettes/${id}`, recette);
            clearEdit();
        } else {
            await axios.post('http://localhost:5000/api/recettes', recette);
        }

        fetchRecettes();
        setTitre('');
        setIngredients('');
        setEtapes('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Titre" required />
            <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Ingrédients (séparés par des virgules)" required />
            <textarea value={etapes} onChange={(e) => setEtapes(e.target.value)} placeholder="Étapes" required></textarea>
            <button type="submit">{id ? 'Modifier Recette' : 'Ajouter Recette'}</button>
        </form>
    );
};

export default RecetteForm;