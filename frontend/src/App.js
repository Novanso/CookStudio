import React, { useEffect, useState, useCallback } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import Calendar from './components/Calendar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    const [recipes, setRecipes] = useState([]);
    const [books, setBooks] = useState([]);
    const [recipeToEdit, setRecipeToEdit] = useState(null);
    const [bookToEdit, setBookToEdit] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [user, setUser] = useState(null);

    const fetchRecipes = useCallback(async () => {
        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };
        const response = await axios.get('http://localhost:5000/api/recipes', config);
        setRecipes(response.data);
    }, [authToken]);

    const fetchBooks = useCallback(async () => {
        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };
        const response = await axios.get('http://localhost:5000/api/books', config);
        setBooks(response.data);
    }, [authToken]);

    const handleDeleteRecipe = async (id) => {
        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };
        await axios.delete(`http://localhost:5000/api/recipes/${id}`, config);
        fetchRecipes();
    };

    const handleEditRecipe = (recipe) => {
        setRecipeToEdit(recipe);
    };

    const clearEditRecipe = () => {
        setRecipeToEdit(null);
    };

    const handleDeleteBook = async (id) => {
        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };
        await axios.delete(`http://localhost:5000/api/books/${id}`, config);
        fetchBooks();
    };

    const handleEditBook = (book) => {
        setBookToEdit(book);
    };

    const clearEditBook = () => {
        setBookToEdit(null);
    };

    const handleLogout = () => {
        setAuthToken(null);
        setUser(null);
    };

    const handleLogin = (token, user) => {
        setAuthToken(token);
        setUser(user);
    };

    useEffect(() => {
        if (authToken) {
            fetchRecipes();
            fetchBooks();
        }
    }, [authToken, fetchRecipes, fetchBooks]);

    return (
        <div className="app-container">
            <div className="vertical-nav">
                <img src="https://i.imgur.com/YLp3k38.png" alt="Logo" class="Main_Logo"/>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Recipes</a></li>
                    <li><a href="#">Books</a></li>
                    <li><a href="#">Calendar</a></li>
                    <li><a href="#">Settings</a></li>
                </ul>
            </div>
            <div className="main-content">
                <div className="horizontal-nav">
                    <span>Tools</span>
                    {authToken && <button onClick={handleLogout}>Logout</button>}
                </div>
                <div className="content">
                    {user && <h2>Welcome, {user.username}!</h2>}
                    <h1>Recipe Application</h1>
                    {!authToken ? (
                        <>
                            <LoginForm setAuthToken={handleLogin} />
                            <RegisterForm />
                        </>
                    ) : (
                        <>
                            <RecipeForm fetchRecipes={fetchRecipes} recipeToEdit={recipeToEdit} clearEdit={clearEditRecipe} authToken={authToken} />
                            <RecipeList recipes={recipes} onDelete={handleDeleteRecipe} onEdit={handleEditRecipe} />
                            <BookForm fetchBooks={fetchBooks} bookToEdit={bookToEdit} clearEdit={clearEditBook} recipes={recipes} authToken={authToken} />
                            <BookList books={books} onDelete={handleDeleteBook} onEdit={handleEditBook} />
                            <Calendar recipes={recipes} authToken={authToken} />
                        </>
                    )}
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}

export default App;