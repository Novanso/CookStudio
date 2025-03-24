import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

// Components
import Home from './components/Home';
import RecipeList from './components/RecipeList';
import BookList from './components/BookList';
import Calendar from './components/Calendar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BookDetails from './components/BookDetails';
import RecipeDetails from './components/RecipeDetails';
import VerticalBar from './components/VerticalBar';
import HorizontalBar from './components/HorizontalBar';
import Profile from './components/Profile';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    if (!token && location.pathname !== '/register') {
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  const handleLogin = (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', user);
    setAuthToken(token);
    navigate('/');
  };

  return (
    <div className="app-container">
      <script src="http://kit.fontawesome.com/c0f3389bdc.js" crossOrigin='anonymous'></script>
      <VerticalBar/>
      <div className="main-content">
        <HorizontalBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/recipes/:id" element={<RecipeDetails />} />
            <Route path="/profile" element={<Profile authToken={authToken} />} />
            <Route path="/settings" element={<Settings authToken={authToken} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;