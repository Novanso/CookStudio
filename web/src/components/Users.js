import React, { useRef, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';
import { ToastContainer, toast } from 'react-toastify';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
        

import DeleteIcon from '../icons/Delete.svg';
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
    const NewRole = e.target.value;
    const updatedUser = { role: NewRole };
    const token = localStorage.getItem('authToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      const update = await axios.put(`http://localhost:5000/api/users/${e.target.parentNode.id}`, updatedUser, config);
      toast.success('User Updated Successfully !',{position: "bottom-right",theme: "dark",pauseOnHover: false});
    } catch (error) {
      toast.error('Failed to update User',{position: "bottom-right",theme: "dark",pauseOnHover: false});
    }
    const response = await axios.get('http://localhost:5000/api/users', config);
    setUsers(response.data);
  }

  
  const confirm = async (id) => {
    confirmDialog({
      message: 'Do you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept: () => handledeleteuser(id),
      reject
    });
  };
  const reject = () => {}

  const handledeleteuser = async (id) => {
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
      <ConfirmDialog />
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
              <Button onClick={() => confirm(user._id)} label="Delete" severity="danger"></Button>
            </div>
        </li>
        ))}
        </ul>
    </div>
  );
};

export default Users;