import React, { useEffect, useState } from 'react';
import RecetteForm from './components/RecetteForm';
import RecetteList from './components/RecetteList';
import axios from 'axios';

function App() {
    const [recettes, setRecettes] = useState([]);
    const [recetteToEdit, setRecetteToEdit] = useState(null);

    const fetchRecettes = async () => {
        const response = await axios.get('http://localhost:5000/api/recettes');
        setRecettes(response.data);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/recettes/${id}`);
        fetchRecettes();
    };

    const handleEdit = (recette) => {
        setRecetteToEdit(recette);
    };

    const clearEdit = () => {
        setRecetteToEdit(null);
    };

    useEffect(() => {
        fetchRecettes();
    }, []);

    return (
        <div>
            <h1>Application de Recettes</h1>
            <RecetteForm fetchRecettes={fetchRecettes} recetteToEdit={recetteToEdit} clearEdit={clearEdit} />
            <RecetteList recettes={recettes} onDelete={handleDelete} onEdit={handleEdit} />
        </div>
    );
}

export default App;