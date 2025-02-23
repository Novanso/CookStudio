import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays, startOfWeek } from 'date-fns';

const Calendrier = ({ recettes }) => {
    const [repas, setRepas] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedRecette, setSelectedRecette] = useState('');
    const [selectedType, setSelectedType] = useState('midi');

    const fetchRepas = async () => {
        const response = await axios.get('http://localhost:5000/api/repas');
        setRepas(response.data);
    };

    const handleAddRepas = async () => {
        const newRepas = {
            date: selectedDate,
            type: selectedType,
            recette: selectedRecette
        };
        await axios.post('http://localhost:5000/api/repas', newRepas);
        fetchRepas();
    };

    useEffect(() => {
        fetchRepas();
    }, []);

    const days = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selectedDate), i));

    return (
        <div>
            <h2>Calendrier des Repas</h2>
            <div>
                {days.map(day => (
                    <div key={day}>
                        <h3>{format(day, 'eeee d MMMM')}</h3>
                        <ul>
                            {repas.filter(r => format(new Date(r.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).map(r => (
                                <li key={r._id}>{r.type}: {r.recette.titre}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div>
                <h3>Ajouter un Repas</h3>
                <input type="date" value={format(selectedDate, 'yyyy-MM-dd')} onChange={e => setSelectedDate(new Date(e.target.value))} />
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                    <option value="midi">Midi</option>
                    <option value="soir">Soir</option>
                </select>
                <select value={selectedRecette} onChange={e => setSelectedRecette(e.target.value)}>
                    <option value="">Sélectionner une recette</option>
                    {recettes.map(recette => (
                        <option key={recette._id} value={recette._id}>{recette.titre}</option>
                    ))}
                </select>
                <button onClick={handleAddRepas}>Ajouter</button>
            </div>
        </div>
    );
};

export default Calendrier;