import React, { useEffect, useState } from 'react';
import RecetteForm from './components/RecetteForm';
import RecetteList from './components/RecetteList';
import LivreForm from './components/LivreForm';
import LivreList from './components/LivreList';
import axios from 'axios';

function App() {
    const [recettes, setRecettes] = useState([]);
    const [livres, setLivres] = useState([]);
    const [recetteToEdit, setRecetteToEdit] = useState(null);
    const [livreToEdit, setLivreToEdit] = useState(null);

    const fetchRecettes = async () => {
        const response = await axios.get('http://localhost:5000/api/recettes');
        setRecettes(response.data);
    };

    const fetchLivres = async () => {
        const response = await axios.get('http://localhost:5000/api/livres');
        setLivres(response.data);
    };

    const handleDeleteRecette = async (id) => {
        await axios.delete(`http://localhost:5000/api/recettes/${id}`);
        fetchRecettes();
    };

    const handleEditRecette = (recette) => {
        setRecetteToEdit(recette);
    };

    const clearEditRecette = () => {
        setRecetteToEdit(null);
    };

    const handleDeleteLivre = async (id) => {
        await axios.delete(`http://localhost:5000/api/livres/${id}`);
        fetchLivres();
    };

    const handleEditLivre = (livre) => {
        setLivreToEdit(livre);
    };

    const clearEditLivre = () => {
        setLivreToEdit(null);
    };

    useEffect(() => {
        fetchRecettes();
        fetchLivres();
    }, []);

    return (
        <div>
            <h1>Application de Recettes</h1>
            <RecetteForm fetchRecettes={fetchRecettes} recetteToEdit={recetteToEdit} clearEdit={clearEditRecette} />
            <RecetteList recettes={recettes} onDelete={handleDeleteRecette} onEdit={handleEditRecette} />
            <LivreForm fetchLivres={fetchLivres} livreToEdit={livreToEdit} clearEdit={clearEditLivre} recettes={recettes} />
            <LivreList livres={livres} onDelete={handleDeleteLivre} onEdit={handleEditLivre} />
        </div>
    );
}

export default App;