import React from 'react';

const RecipeList = ({ recipes, onDelete, onEdit }) => {
    return (
        <div>
            <h2>Recipe List</h2>
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        <h3>{recipe.title}</h3>
                        <p>Ingredients: {recipe.ingredients.join(', ')}</p>
                        <p>Steps: {recipe.steps}</p>
                        <button onClick={() => onEdit(recipe)}>Edit</button>
                        <button onClick={() => onDelete(recipe._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeList;