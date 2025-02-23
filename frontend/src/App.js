import React, { useEffect, useState, useCallback } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import Calendar from './components/Calendar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import axios from 'axios';

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
    <div>
      <h1>Recipe Application</h1>
      {!authToken ? (
        <>
          <LoginForm setAuthToken={handleLogin} />
          <RegisterForm />
        </>
      ) : (
        <>
          <div>
            <span>Welcome, {user?.username}!</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <RecipeForm
            fetchRecipes={fetchRecipes}
            recipeToEdit={recipeToEdit}
            clearEdit={clearEditRecipe}
            authToken={authToken}
          />
          <RecipeList
            recipes={recipes}
            onDelete={handleDeleteRecipe}
            onEdit={handleEditRecipe}
          />
          <BookForm
            fetchBooks={fetchBooks}
            bookToEdit={bookToEdit}
            clearEdit={clearEditBook}
            recipes={recipes}
            authToken={authToken}
          />
          <BookList
            books={books}
            onDelete={handleDeleteBook}
            onEdit={handleEditBook}
          />
          <Calendar recipes={recipes} authToken={authToken} />
        </>
      )}
    </div>
  );
}

export default App;