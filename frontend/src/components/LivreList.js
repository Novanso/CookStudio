import React from 'react';

const LivreList = ({ livres, onDelete, onEdit }) => {
    return (
        <div>
            <h2>Liste des Livres de Recettes</h2>
            <ul>
                {livres.map((livre) => (
                    <li key={livre._id}>
                        <h3>{livre.titre}</h3>
                        <p>{livre.description}</p>
                        <ul>
                            {livre.recettes.map((recette) => (
                                <li key={recette._id}>{recette.titre}</li>
                            ))}
                        </ul>
                        <button onClick={() => onEdit(livre)}>Modifier</button>
                        <button onClick={() => onDelete(livre._id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LivreList;