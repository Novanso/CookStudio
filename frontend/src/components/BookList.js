import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import BookForm from './BookForm'; // Import du composant BookForm
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchBooks = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get('http://localhost:5000/api/books', config);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleAddBook = () => {
    setShowForm(true);
  };

  return (
    <div>
      <div className="book-grid">
        <div className="book-card add-book-card" onClick={handleAddBook}>
          <p>Add Book</p>
        </div>
        {books.map((book) => (
          <div className="book-card" key={book.id}>
            <p>{book.title}</p>
          </div>
        ))}
      </div>
      {showForm && (
        <BookForm fetchBooks={fetchBooks} />
      )}
    </div>
  );
}

export default BookList;