import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './style/Calendar.css'; // Importer le fichier CSS pour les styles
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const FullScreenCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [meals, setMeals] = useState({});
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const mealTypes = ['Lunch', 'Dinner'];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get('http://localhost:5000/api/recipes/', config);
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const formattedDate = (`${year}-${month}-${day}`);
        const response = await axios.get(`http://localhost:5000/api/meals/${formattedDate}`);
        setMeals((prevMeals) => ({
          ...prevMeals,
          [formattedDate]: response.data,
        }));
        console.log(meals)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`No meals found for ${date.toDateString()}`);
        } else {
          console.error('Error fetching meals:', error);
        }
      }
    };
    fetchMeals();
  }, [date]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleMealChange = async (selectedOption, mealType) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = (`${year}-${month}-${day}`);
    const updatedMeals = {
      ...meals,
      [formattedDate]: {
        ...meals[formattedDate],
        [mealType]: selectedOption ? selectedOption.value : '',
      },
    };
    setMeals(updatedMeals);

    try {
      await axios.post(`http://localhost:5000/api/meals/${formattedDate}`, {
        lunch: updatedMeals[formattedDate].Lunch,
        dinner: updatedMeals[formattedDate].Dinner,
      });
    } catch (error) {
      if (error.response.status === 404) {
        console.log(`No meals found for ${date.toDateString()}`);
      }
    }
  };

  const getRecipeName = (recipeId) => {
    const recipe = recipes.find((r) => r._id === recipeId);
    return recipe ? recipe.name : '-';
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const formattedDate = (`${year}-${month}-${day}`);
      const meal = meals[formattedDate] || {};
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
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const selectedDate = (`${year}-${month}-${day}`);
    const recipeId = meals[selectedDate] && meals[selectedDate][mealType];
    if (recipeId) {
      navigate(`/recipes/${recipeId}`);
    }
  };

  return (
    <div className="fullscreen-calendar">
      <Calendar
        onChange={handleDateChange}
        value={date}
        tileContent={tileContent}
      />
      <div className="meal-selector">
        <h2>Select meals for {date.toDateString()}</h2>
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