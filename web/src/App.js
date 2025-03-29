import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

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
import SwitchAccount from './components/SwitchAccount';

// CSS
import './App.css';
import './components/style/Auth.css'
import './components/style/BookDetails.css'
import './components/style/BookList.css'
import './components/style/Calendar.css'
import './components/style/Form.css'
import './components/style/Notification.css'
import './components/style/RecipeDetails.css'
import './components/style/RecipeList.css'
import './components/style/Settings.css'

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
      {authToken && (<VerticalBar/>)}
      {authToken && (
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
            <Route path="/switch-account" element={<SwitchAccount />} />
          </Routes>
        </div>
      </div>
      )}
      {!authToken && (
        <div className="main-content">
        <HorizontalBar />
        <div className="login-content">
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/recipes/:id" element={<RecipeDetails />} />
            <Route path="/switch-account" element={<SwitchAccount />} />
          </Routes>
        </div>
      </div>
      )}
    </div>
  );
}

export default App;