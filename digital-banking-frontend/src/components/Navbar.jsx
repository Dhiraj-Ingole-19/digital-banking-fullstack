// src/components/Navbar.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, Wallet } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar glass-panel">
      <Link to="/dashboard" className="navbar-brand">
        <Wallet className="brand-icon" />
        <span className="brand-text">The Digital Bank</span>
      </Link>

      <div className="navbar-user-menu">
        {user && (
          <span className="navbar-welcome-text mobile-hidden">
            Welcome, {user.username}
          </span>
        )}

        <button onClick={logout} className="navbar-logout-btn" title="Log Out">
          <LogOut size={20} />
          <span className="mobile-hidden">Log Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;