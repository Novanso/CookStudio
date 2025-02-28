import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './style/BookDetails.css'

import EditIcon from '../icons/Edit.svg';
import DeleteIcon from '../icons/Delete.svg';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(`http://localhost:5000/api/books/${id}`, config);
        setBook(response.data);
      } catch (error) {
        const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to fetch book details';
        setError(errorMessage);
      }
    };
    fetchBookDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`http://localhost:5000/api/books/${id}`, config);
      navigate('/books');
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Failed to delete book';
      setError(errorMessage);
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div class="bookHeader">
              <h1>{book.title}</h1>
              <button><img src={EditIcon} alt="Edit" className="edit-icon" /></button>
              <button onClick={handleDelete}><img src={DeleteIcon} alt="Delete" className="delete-icon" /></button>
            </div>
      <p>{book.description}</p>
      <h2>Recipes</h2>
      <ul>
        {book.recipes.map(recipe => (
          <li key={recipe._id}>{recipe.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookDetails;