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
  const mealTypes = ['lunch', 'dinner'];

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

  useEffect(() => {
    const fetchAllMeals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/meals');
        setMeals(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching all meals:', error);
      }
    };
    fetchAllMeals();
  }, []);

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
    const response = await axios.post(`http://localhost:5000/api/meals/${formattedDate}`, {
      lunch: updatedMeals[formattedDate].lunch,
      dinner: updatedMeals[formattedDate].dinner,
    });
    // Mettre à jour l'état des repas avec la réponse du serveur
    setMeals(prevMeals => ({
      ...prevMeals,
      [formattedDate]: response.data
    }));
  } catch (error) {
    console.error('Error saving meals:', error);
  }
};

  const getRecipeName = (recipeId) => {
    if (!recipeId) return '-';
    const recipe = recipes.find((r) => r._id === recipeId);
    return recipe ? recipe.name : '-';
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const formattedDate = (`${year}-${month}-${day}`);
      var meal = {};
      if(Array.isArray(meals)) {
        meal = meals.find(meal => meal.date === formattedDate) ||{};
      }
      return (
        <div className="tile-content">
          {mealTypes.map((mealType) => (
            <div key={mealType}>
              {meal[mealType] ? getRecipeName(meal[mealType]) : '-'}
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

  const getRecipe = (mealType) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = (`${year}-${month}-${day}`);
    var meal = {};
    if(Array.isArray(meals)) {
      meal = meals.find(meal => meal.date === formattedDate) ||{};
    }
    const meal_recipe = meal[mealType];
    const true_recipe = recipeOptions.find((option) => option.value === meal_recipe);
    return true_recipe;
  };

  const handleViewDetails = (mealType) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = (`${year}-${month}-${day}`);
    const recipeId = meals[formattedDate] && meals[formattedDate][mealType];
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
                // value={recipeOptions.find((option) => option.value === (meals.find(meal => meal.date === `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`)))}
                value = {() => getRecipe(mealType)}
                onChange={(selectedOption) => handleMealChange(selectedOption, mealType)}
                options={recipeOptions}
                placeholder="Select a recipe"
                isClearable
              />
              <button
                onClick={() => handleViewDetails(mealType)}
                disabled={!meals[`${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`] || !meals[`${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`][mealType]}
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