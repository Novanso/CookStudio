import React from 'react';

const BookList = ({ books, onDelete, onEdit }) => {
    return (
        <div>
            <h2>Recipe Books</h2>
            <ul>
                {books.map((book) => (
                    <li key={book._id}>
                        <h3>{book.title}</h3>
                        <p>{book.description}</p>
                        <ul>
                            {book.recipes.map((recipe) => (
                                <li key={recipe._id}>{recipe.title}</li>
                            ))}
                        </ul>
                        <button onClick={() => onEdit(book)}>Edit</button>
                        <button onClick={() => onDelete(book._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookList;