import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NextIcon from '../icons/Next.svg';
import BackIcon from '../icons/Back.svg';
import PictureIcon from '../icons/Picture.svg'
import SelectIcon from '../icons/Select.svg'
import AdminIcon from '../icons/Administration.svg'
import SettingsIcon from '../icons/Settings.svg'
import SwitchAccountIcon from '../icons/Switch-Account.svg';
import LogoutIcon from '../icons/Logout.svg';
import { LanguageContext } from '../context/LanguageContext';

const HorizontalBar = () => {
    const [username, setUsername] = useState('');
    const [authToken, setAuthToken] = useState(null);
    const [profilePicture, setProfilePicture] = useState('');
    const [pageTitle, setPageTitle] = useState('Tools');
    const [showDropdown, setShowDropdown] = useState(false);

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
        toggleDropdown();
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        setAuthToken(null);
        setUsername('');
        navigate('/login');
    };

    const handleAccount = () => {
      toggleDropdown();
      navigate('/settings');
    };

    const handleAdmin = () => {
      toggleDropdown();
      navigate('/administration');
    };

    const goBack = () => {
        navigate(-1);
    };

    const goForward = () => {
        navigate(1);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const profileButton = document.getElementById('dropdownProfileButton')
    
    document.addEventListener('click', (e) => {
      if(profileButton) {
        if(!profileButton.contains(e.target)) setShowDropdown(false)
      }
    });

    return (
      <div>
        {!authToken && (
          <div className="login-horizontal">
            <img src="https://i.imgur.com/YLp3k38.png" alt="Logo" className="Full_Logo" />
          </div>
        )}
        {authToken && (
        <div className="horizontal-nav">
          <div className="nav-buttons">
            <button onClick={goBack}><img src={BackIcon} alt="Back" className="nav-icon" /></button>
            <button onClick={goForward}><img src={NextIcon} alt="Next" className="nav-icon" /></button>
          </div>
          <h1>{pageTitle}</h1>
          <div className="auth-section">
            {authToken ? (
              <>
                <div className='user-icon' id="dropdownProfileButton" onClick={toggleDropdown}>
                  {profilePicture && <img src={profilePicture} alt="Profile-picture" className="profile-picture" />}
                  {!profilePicture && <img src={PictureIcon} alt="Profile-picture" className="no-profile-picture" />}
                </div>
                {showDropdown && (
                    <div className="dropdown-menu">
                        <div className='drop-account'>
                          {profilePicture && <img src={profilePicture} alt="Profile-picture" className="profile-picture" />}
                          {!profilePicture && <img src={PictureIcon} alt="Profile-picture" className="no-profile-picture" />}
                          <span>{username}</span>
                        </div>
                        <button onClick={handleAccount}><img src={SettingsIcon}/>Settings</button>
                        <button onClick={handleAdmin}><img src={AdminIcon}/>Admin Section</button>
                        <button onClick={handleLogout}><img src={LogoutIcon} />Logout</button>
                    </div>
                    )}
              </>
            ) : (
              <>
                <Link to="/login"><button>Login</button></Link>
                <Link to="/register"><button>Register</button></Link>
              </>
            )}
          </div>
        </div>)}
        
      </div>
    )
};

export default HorizontalBar;