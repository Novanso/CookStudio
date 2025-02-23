import React from 'react';

const RecetteList = ({ recettes, onDelete, onEdit }) => {
    return (
        <div>
            <h2>Liste des Recettes</h2>
            <ul>
                {recettes.map((recette) => (
                    <li key={recette._id}>
                        <h3>{recette.titre}</h3>
                        <p>Ingrédients: {recette.ingredients.join(', ')}</p>
                        <p>Étapes: {recette.etapes}</p>
                        <button onClick={() => onEdit(recette)}>Modifier</button>
                        <button onClick={() => onDelete(recette._id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecetteList;