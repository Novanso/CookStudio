import React, { useEffect, useState } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import Calendar from './components/Calendar';
import axios from 'axios';

function App() {
    const [recipes, setRecipes] = useState([]);
    const [books, setBooks] = useState([]);
    const [recipeToEdit, setRecipeToEdit] = useState(null);
    const [bookToEdit, setBookToEdit] = useState(null);

    const fetchRecipes = async () => {
        const response = await axios.get('http://localhost:5000/api/recipes');
        setRecipes(response.data);
    };

    const fetchBooks = async () => {
        const response = await axios.get('http://localhost:5000/api/books');
        setBooks(response.data);
    };

    const handleDeleteRecipe = async (id) => {
        await axios.delete(`http://localhost:5000/api/recipes/${id}`);
        fetchRecipes();
    };

    const handleEditRecipe = (recipe) => {
        setRecipeToEdit(recipe);
    };

    const clearEditRecipe = () => {
        setRecipeToEdit(null);
    };

    const handleDeleteBook = async (id) => {
        await axios.delete(`http://localhost:5000/api/books/${id}`);
        fetchBooks();
    };

    const handleEditBook = (book) => {
        setBookToEdit(book);
    };

    const clearEditBook = () => {
        setBookToEdit(null);
    };

    useEffect(() => {
        fetchRecipes();
        fetchBooks();
    }, []);

    return (
        <div>
            <h1>Recipe Application</h1>
            <RecipeForm fetchRecipes={fetchRecipes} recipeToEdit={recipeToEdit} clearEdit={clearEditRecipe} />
            <RecipeList recipes={recipes} onDelete={handleDeleteRecipe} onEdit={handleEditRecipe} />
            <BookForm fetchBooks={fetchBooks} bookToEdit={bookToEdit} clearEdit={clearEditBook} recipes={recipes} />
            <BookList books={books} onDelete={handleDeleteBook} onEdit={handleEditBook} />
            <Calendar recipes={recipes} />
        </div>
    );
}

export default App;