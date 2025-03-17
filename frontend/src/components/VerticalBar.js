import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '../icons/Home.svg';
import RecipesIcon from '../icons/Recipe.svg';
import BooksIcon from '../icons/Library.svg';
import CalendarIcon from '../icons/Calendar.svg';
import { LanguageContext } from '../context/LanguageContext';

const VerticalBar = ({ authToken }) => {
    const { texts } = useContext(LanguageContext);

    return (
        <div className="vertical-nav">
          <img src="https://i.imgur.com/PdseOyn.png" alt="Logo" className="Main_Logo" />
          <ul>
            <li title={texts.home}><Link to="/"><img src={HomeIcon} alt="Home" className="nav-icon" /></Link></li>
            <li title={texts.recipes}><Link to="/recipes"><img src={RecipesIcon} alt="Recipes" className="nav-icon" /></Link></li>
            <li title={texts.books}><Link to="/books"><img src={BooksIcon} alt="Books" className="nav-icon" /></Link></li>
            <li title={texts.calendar}><Link to="/calendar"><img src={CalendarIcon} alt="Calendar" className="nav-icon" /></Link></li>
          </ul>
        </div>
    )
};

export default VerticalBar;