import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays, startOfWeek } from 'date-fns';

const Calendar = ({ recipes }) => {
    const [meals, setMeals] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedRecipe, setSelectedRecipe] = useState('');
    const [selectedType, setSelectedType] = useState('lunch');

    const fetchMeals = async () => {
        const response = await axios.get('http://localhost:5000/api/meals');
        setMeals(response.data);
    };

    const handleAddMeal = async () => {
        const newMeal = {
            date: selectedDate,
            type: selectedType,
            recipe: selectedRecipe
        };
        await axios.post('http://localhost:5000/api/meals', newMeal);
        fetchMeals();
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    const days = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selectedDate), i));

    return (
        <div>
            <h2>Meal Calendar</h2>
            <div>
                {days.map(day => (
                    <div key={day}>
                        <h3>{format(day, 'eeee d MMMM')}</h3>
                        <ul>
                            {meals.filter(m => format(new Date(m.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).map(m => (
                                <li key={m._id}>{m.type}: {m.recipe.title}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div>
                <h3>Add a Meal</h3>
                <input type="date" value={format(selectedDate, 'yyyy-MM-dd')} onChange={e => setSelectedDate(new Date(e.target.value))} />
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                </select>
                <select value={selectedRecipe} onChange={e => setSelectedRecipe(e.target.value)}>
                    <option value="">Select a recipe</option>
                    {recipes.map(recipe => (
                        <option key={recipe._id} value={recipe._id}>{recipe.title}</option>
                    ))}
                </select>
                <button onClick={handleAddMeal}>Add</button>
            </div>
        </div>
    );
};

export default Calendar;