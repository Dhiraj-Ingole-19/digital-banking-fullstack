// src/components/Navbar.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserCircle, Wallet } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();

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

        <Link to="/settings" className="nav-profile-icon" title="Profile & Settings">
          <UserCircle size={28} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;