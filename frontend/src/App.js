import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import RecipeList from './components/RecipeList';
import BookList from './components/BookList';
import Calendar from './components/Calendar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BookDetails from './components/BookDetails';
import RecipeDetails from './components/RecipeDetails';
import Settings from './components/Settings';
import './App.css';

// Icons
import HomeIcon from './icons/Home.svg';
import RecipesIcon from './icons/Recipe.svg';
import BooksIcon from './icons/Library.svg';
import CalendarIcon from './icons/Calendar.svg';
import LogoutIcon from './icons/Logout.svg';
import NextIcon from './icons/Next.svg';
import BackIcon from './icons/Back.svg';
import SettingsIcon from './icons/Settings.svg'
import SelectIcon from './icons/Select.svg'

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [pageTitle, setPageTitle] = useState('Tools');
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('username');
    setAuthToken(token);
    setUsername(user);
    if (!token && location.pathname !== '/register') {
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setPageTitle('Home');
        break;
      case '/recipes':
        setPageTitle('Recipes');
        break;
      case '/books':
        setPageTitle('Books');
        break;
      case '/calendar':
        setPageTitle('Calendar');
        break;
      case '/settings':
        setPageTitle('Settings');
        break;
      case '/login':
        setPageTitle('Login');
        break;
      case '/register':
        setPageTitle('Register');
        break;
      default:
        setPageTitle('');
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authToken) {
        try {
          const response = await fetch('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const data = await response.json();
          setProfilePicture(data.profilePicture || '');
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [authToken]);

  const handleLogin = (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', user);
    setAuthToken(token);
    setUsername(user);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setAuthToken(null);
    setUsername('');
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const goBack = () => {
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
  };

  const toggleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <div className={`app-container ${isNavCollapsed ? 'collapsed' : ''}`}>
      <div className="vertical-nav">
        <img src={isNavCollapsed ? "https://i.imgur.com/PdseOyn.png" : "https://i.imgur.com/YLp3k38.png"} alt="Logo" className="Main_Logo" />
        <ul>
          <li title="Home"><Link to="/"><img src={HomeIcon} alt="Home" className="nav-icon" />{!isNavCollapsed && ' Home'}</Link></li>
          <li title="Recipes"><Link to="/recipes"><img src={RecipesIcon} alt="Recipes" className="nav-icon" />{!isNavCollapsed && ' Recipes'}</Link></li>
          <li title="Books"><Link to="/books"><img src={BooksIcon} alt="Books" className="nav-icon" />{!isNavCollapsed && ' Books'}</Link></li>
          <li title="Calendar"><Link to="/calendar"><img src={CalendarIcon} alt="Calendar" className="nav-icon" />{!isNavCollapsed && ' Calendar'}</Link></li>
        </ul>
      </div>
      <div className="main-content">
        <div className="horizontal-nav">
          <div className="nav-buttons">
            <button onClick={goBack}><img src={BackIcon} alt="Back" className="nav-icon" /></button>
            <button onClick={goForward}><img src={NextIcon} alt="Next" className="nav-icon" /></button>
          </div>
          <h1>{pageTitle}</h1>
          <div className="auth-section">
            {authToken ? (
              <>
                <button onClick={handleSettings} className="settings-btn">
                  <img src={SettingsIcon} alt="Settings" className="nav-icon" />
                </button>
                <div className='user-account'>
                  {profilePicture && <img src={profilePicture} alt="Profile" className="profile-picture" />}
                  <span>{username}</span>
                  <button className="settings-btn">
                    <img src={SelectIcon} alt="Select" className="nav-icon" />
                  </button>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  <img src={LogoutIcon} alt="Logout" className="logout-icon" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login"><button>Login</button></Link>
                <Link to="/register"><button>Register</button></Link>
              </>
            )}
          </div>
        </div>
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
            <Route path="/settings" element={<Settings authToken={authToken} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;