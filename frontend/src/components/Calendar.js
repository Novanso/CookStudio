import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './style/Calendar.css'; // Importer le fichier CSS pour les styles
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const FullScreenCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [meals, setMeals] = useState({});
  const [recipes, setRecipes] = useState([]);
  const mealTypes = ['Lunch', 'Dinner'];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get('http://localhost:5000/api/recipes', config);
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  const handleMealChange = (selectedOption, mealType) => {
    const selectedDate = date.toDateString();
    setMeals({
      ...meals,
      [selectedDate]: {
        ...meals[selectedDate],
        [mealType]: selectedOption ? selectedOption.value : '',
      },
    });
  };

  const getRecipeName = (recipeId) => {
    const recipe = recipes.find((r) => r._id === recipeId);
    return recipe ? recipe.name : '-';
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const selectedDate = date.toDateString();
      const meal = meals[selectedDate] || {};
      return (
        <div className="tile-content">
          {mealTypes.map((mealType) => (
            <div key={mealType}>
              {getRecipeName(meal[mealType])}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const recipeOptions = recipes.map((recipe) => ({
    value: recipe._id,
    label: recipe.name,
  }));

  const handleViewDetails = (mealType) => {
    const selectedDate = date.toDateString();
    const recipeId = meals[selectedDate] && meals[selectedDate][mealType];
    if (recipeId) {
      navigate(`/recipes/${recipeId}`);
    }
  };

  return (
    <div className="fullscreen-calendar">
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent}
      />
      <div className="meal-selector">
        <div>Select meals for </div><br></br><div>{date.toDateString()}</div>
        <div className="meal-columns">
          {mealTypes.map((mealType) => (
            <div key={mealType} className="meal-column">
              <h3>{mealType}</h3>
              <Select
                value={recipeOptions.find((option) => option.value === (meals[date.toDateString()] && meals[date.toDateString()][mealType]))}
                onChange={(selectedOption) => handleMealChange(selectedOption, mealType)}
                options={recipeOptions}
                placeholder="Select a recipe"
                isClearable
              />
              <button
                onClick={() => handleViewDetails(mealType)}
                disabled={!meals[date.toDateString()] || !meals[date.toDateString()][mealType]}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullScreenCalendar;
