// src/components/Navbar.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserCircle, Wallet, LogOut, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to={user ? "/dashboard" : "/"} className="navbar-brand" onClick={closeMenu}>
          <Wallet className="brand-icon" />
          <span className="brand-text">The Digital Bank</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-desktop-menu">
          {!user && (
            <>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
              <Link to="/login" className="btn-nav-login">Login</Link>
              <Link to="/register" className="btn-nav-register">Register</Link>
            </>
          )}

          {user && (
            <>
              <span className="navbar-welcome-text">
                Welcome, {user.username}
              </span>
              <Link to="/settings" className="nav-profile-icon" title="Profile & Settings">
                <UserCircle size={28} />
              </Link>
              <button onClick={logout} className="navbar-logout-btn" aria-label="Log Out">
                <LogOut size={20} />
                <span className="desktop-only">Logout</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-menu glass-panel">
          {!user && (
            <>
              <Link to="/about" className="mobile-nav-link" onClick={closeMenu}>About</Link>
              <Link to="/contact" className="mobile-nav-link" onClick={closeMenu}>Contact</Link>
              <Link to="/login" className="mobile-btn-login" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="mobile-btn-register" onClick={closeMenu}>Register</Link>
            </>
          )}

          {user && (
            <>
              <div className="mobile-user-info">
                <UserCircle size={32} />
                <span>{user.username}</span>
              </div>
              <Link to="/settings" className="mobile-nav-link" onClick={closeMenu}>Profile & Settings</Link>
              <button onClick={() => { logout(); closeMenu(); }} className="mobile-nav-link mobile-logout">
                <LogOut size={20} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;