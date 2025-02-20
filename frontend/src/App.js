import React, { useEffect, useState } from 'react';
import RecetteForm from './components/RecetteForm';
import RecetteList from './components/RecetteList';
import axios from 'axios';

function App() {
    const [recettes, setRecettes] = useState([]);

    const fetchRecettes = async () => {
        const response = await axios.get('http://localhost:5000/api/recettes');
        setRecettes(response.data);
    };

    useEffect(() => {
        fetchRecettes();
    }, []);

    return (
        <div>
            <h1>Application de Recettes</h1>
            <RecetteForm fetchRecettes={fetchRecettes} />
            <RecetteList recettes={recettes} />
        </div>
    );
}

export default App;