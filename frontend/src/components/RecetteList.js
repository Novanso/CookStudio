import React from 'react';

const RecetteList = ({ recettes }) => {
    return (
        <div>
            <h2>Liste des Recettes</h2>
            <ul>
                {recettes.map((recette) => (
                    <li key={recette._id}>
                        <h3>{recette.titre}</h3>
                        <p>Ingrédients: {recette.ingredients.join(', ')}</p>
                        <p>Étapes: {recette.etapes}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecetteList;