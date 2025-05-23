import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';
import { ToastContainer, toast } from 'react-toastify';

import DeleteIcon from '../icons/Delete.svg';
import EditPictureIcon from '../icons/EditPicture.svg';
import PictureIcon from '../icons/Picture.svg';

const Users = ({ authToken }) => {
  const [users, setUsers] = useState(null);
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
        toast.error('Failed to fetch Users',{position: "bottom-right",theme: "dark",pauseOnHover: false});
      }
    };

    fetchUser();
  }, [authToken]);

  const handleChangeRole = async (e) => {
    console.log('test')
  }
  const handlePicture = async (e) => {
    console.log('test')
  }
  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem('authToken');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    try {
      const response = await axios.delete(`http://localhost:5000/api/users/${id}`, config);
      toast.success('User Successfully Deleted !',{position: "bottom-right",theme: "dark",pauseOnHover: false});
    } catch (error) {
      toast.error('Failed to delete User',{position: "bottom-right",theme: "dark",pauseOnHover: false});
    }
    const response = await axios.get('http://localhost:5000/api/users', config);
    setUsers(response.data);
  }

  return (
    <div className="ad_users-container">
      <ToastContainer />
      <ul className="ad_users">
      {users && users.map((user, index) => (
        <li key={index} className="ad_user-li">
            <div className="ad_user">
            {user.profilePicture && (
              <img src={'http://localhost:3000/' + user.profilePicture} />
            )}
            {!user.profilePicture && (
              <img src={PictureIcon} />
            )}
            {user.username}
            </div>
            <div className='usersActionButtons' id={user._id}>
              <select key={user._id} value={user.role} className='userRoleSelect' onChange={handleChangeRole}>
                <option>SuperAdmin</option>
                <option>Admin</option>
                <option>User</option>
              </select>
              <label className="PictureButton" htmlFor={'input_' + user._id}><img src={EditPictureIcon} /></label>
              <input type="File" id={'input_' + user._id} onChange={handlePicture}></input>
              <button className="DeleteButton" onClick={() => handleDeleteUser(user._id)}><img src={DeleteIcon} alt={texts.delete} className="delete-icon" /></button>
            </div>
        </li>
        ))}
        </ul>
    </div>
  );
};

export default Users;