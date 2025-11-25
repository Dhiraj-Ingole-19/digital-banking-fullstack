// src/components/Navbar.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserCircle, Wallet, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar glass-panel">
      <Link to={user ? "/dashboard" : "/"} className="navbar-brand">
        <Wallet className="brand-icon" />
        <span className="brand-text">The Digital Bank</span>
      </Link>

      <div className="navbar-user-menu">
        {!user && (
          <>
            <Link to="/about" className="nav-link" style={{ marginRight: '1rem', color: 'var(--color-text)', textDecoration: 'none', fontWeight: '500' }}>About</Link>
            <Link to="/contact" className="nav-link" style={{ marginRight: '1rem', color: 'var(--color-text)', textDecoration: 'none', fontWeight: '500' }}>Contact</Link>
            <Link to="/login" className="btn-nav-login" style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', color: 'var(--color-primary)', fontWeight: 'bold' }}>Login</Link>
            <Link to="/register" className="btn-nav-register" style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
          </>
        )}

        {user && (
          <>
            <span className="navbar-welcome-text mobile-hidden">
              Welcome, {user.username}
            </span>

            <Link to="/settings" className="nav-profile-icon" title="Profile & Settings">
              <UserCircle size={28} />
            </Link>

            <button onClick={logout} className="mobile-logout-btn mobile-only" aria-label="Log Out">
              <LogOut size={24} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;