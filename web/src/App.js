import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Components
import Auth from './components/Auth';
import Home from './components/Home';
import RecipeList from './components/RecipeList';
import BookList from './components/BookList';
import Calendar from './components/Calendar';
import BookDetails from './components/BookDetails';
import RecipeDetails from './components/RecipeDetails';
import VerticalBar from './components/VerticalBar';
import HorizontalBar from './components/HorizontalBar';
import Settings from './components/Settings';
import Administration from './components/Administration';

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


import "primereact/resources/themes/lara-dark-blue/theme.css";


function App() {
  const [authToken, setAuthToken] = useState(null);
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    if (!token) {
      navigate('/auth');
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
      const fetchUserProfile = async () => {
        if (authToken) {
          try {
            const response = await fetch('http://localhost:5000/api/users/me', {
              headers: { Authorization: `Bearer ${authToken}` },
            });
            const data = await response.json();
            setRole(data.role)
          } catch (error) {
            console.error('Failed to fetch user profile:', error);
          }
        }
      };
  
      fetchUserProfile();
    }, [authToken]
  );

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
      <div className="main-content">
        <HorizontalBar />
        <div className={`${authToken ? "" : "login-"}content`}>
          <Routes>
            <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/recipes/:id" element={<RecipeDetails />} />
          </Routes>
          {authToken && (
            <Routes>
              <Route path="/settings" element={<Settings authToken={authToken} />} />
            </Routes>
          )}
          {authToken && role === 'SuperAdmin' &&(
            <Routes>
              <Route path="/administration" element={<Administration authToken={authToken} />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;