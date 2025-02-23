import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LivreForm = ({ fetchLivres, livreToEdit, clearEdit, recettes }) => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [selectedRecettes, setSelectedRecettes] = useState([]);
    const [id, setId] = useState(null);

    useEffect(() => {
        if (livreToEdit) {
            setTitre(livreToEdit.titre);
            setDescription(livreToEdit.description);
            setSelectedRecettes(livreToEdit.recettes.map(recette => recette._id));
            setId(livreToEdit._id);
        }
    }, [livreToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const livre = { titre, description, recettes: selectedRecettes };

        if (id) {
            await axios.put(`http://localhost:5000/api/livres/${id}`, livre);
            clearEdit();
        } else {
            await axios.post('http://localhost:5000/api/livres', livre);
        }

        fetchLivres();
        setTitre('');
        setDescription('');
        setSelectedRecettes([]);
    };

    const handleRecetteChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedRecettes(value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Titre" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
            <select multiple={true} value={selectedRecettes} onChange={handleRecetteChange}>
                {recettes.map((recette) => (
                    <option key={recette._id} value={recette._id}>{recette.titre}</option>
                ))}
            </select>
            <button type="submit">{id ? 'Modifier Livre' : 'Ajouter Livre'}</button>
        </form>
    );
};

export default LivreForm;