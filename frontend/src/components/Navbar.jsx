// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  // Always check for the key "token"
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token'); // Always remove the key "token"
    navigate('/login');
  };
  
  // (Your existing professional JSX for the navbar remains here)
  return (
    <nav className="public-nav">{/*...Your Navbar JSX...*/} </nav>
  );
};

export default Navbar;