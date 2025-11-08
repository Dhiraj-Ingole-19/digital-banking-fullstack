// src/components/Navbar.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  const { user, logout } = useAuth(); 

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        Laxmi Chit Fund
      </Link>
      <div className="navbar-user-menu">
        {user && (
          <span className="navbar-welcome-text">
            Welcome, {user.username}
          </span>
        )}
        
        <Link to="/settings" className="navbar-settings-link">
          Settings
        </Link>
        
        <button onClick={logout} className="navbar-logout-btn">
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;