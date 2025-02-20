import React, { useState } from 'react';
import axios from 'axios';

const RecetteForm = ({ fetchRecettes }) => {
    const [titre, setTitre] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [etapes, setEtapes] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nouvelleRecette = { titre, ingredients: ingredients.split(','), etapes };
        await axios.post('http://localhost:5000/api/recettes', nouvelleRecette);
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
            <button type="submit">Ajouter Recette</button>
        </form>
    );
};

export default RecetteForm;