import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import EditPictureIcon from '../icons/EditPicture.svg'
import { LanguageContext } from '../context/LanguageContext';

const Users = ({ authToken }) => {
  const [users, setUsers] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { texts } = useContext(LanguageContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${authToken}` },
        };
        const response = await axios.get('http://localhost:5000/api/users', config);
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [authToken]);

  return (
    <div className="user-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {users && users.map((user, index) => (
        <li key={index} className="user-item">
            {user.username}
        </li>
        ))}
    </div>
  );
};

export default Users;