import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogoutIcon from '../icons/Logout.svg';
import NextIcon from '../icons/Next.svg';
import BackIcon from '../icons/Back.svg';
import SettingsIcon from '../icons/Settings.svg'
import SelectIcon from '../icons/Select.svg'
import { LanguageContext } from '../context/LanguageContext';

const HorizontalBar = () => {
    const [username, setUsername] = useState('');
    const [authToken, setAuthToken] = useState(null);
    const [profilePicture, setProfilePicture] = useState('');
    const [pageTitle, setPageTitle] = useState('Tools');
    const navigate = useNavigate();
    const location = useLocation();
    const { texts, changeLanguage } = useContext(LanguageContext);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language');
        const user = localStorage.getItem('username');
        const token = localStorage.getItem('authToken');
        setAuthToken(token);
        setUsername(user);
        if (!token && location.pathname !== '/register') {
            navigate('/login');
          }
        if (storedLanguage) {
          changeLanguage(storedLanguage);
        }
    
        const pathToTitle = {
          '/': texts.home,
          '/recipes': texts.recipes,
          '/books': texts.books,
          '/calendar': texts.calendar,
          '/settings': texts.settings,
          '/login': texts.login,
          '/register': texts.register,
        };
    
        setPageTitle(pathToTitle[location.pathname] || '');
      }, [location.pathname, texts]
    );

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
      }, [authToken]
    );

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

    return (
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
    )
};

export default HorizontalBar;