// src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 

const HomePage = () => {
  return (
    <div className="home-container">
      {/* --- Header / Navbar --- */}
      <header className="home-header">
        <div className="home-nav-brand">
          The Digital Bank
        </div>
        <div className="home-nav-actions">
          <Link to="/login" className="btn-nav-login">Login</Link>
          <Link to="/register" className="btn-nav-register">Register</Link>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Banking Made Simple.</h1>
          <p className="hero-subtitle">
            Manage your finances, invest your money, and secure your future.
            All in one secure platform.
          </p>
          <Link to="/register" className="btn-hero-cta">Open an Account Today</Link>
        </div>
        
        {/* --- THIS IS THE FIX --- */}
        {/* We use the correct wrapper class and the local image path */}
        <div className="hero-image-wrapper">
          <img 
            src="/hero-image.jpg" 
            alt="Person using online banking on a mobile phone" 
            className="hero-image"
          />
        </div>
        {/* --- END OF FIX --- */}

      </section>

      {/* --- Features Section --- */}
      <section className="features-section">
        <h2 className="section-title">Your Complete Financial Hub</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🏦 Save</h3>
            <p>Earn up to 7.5% on Fixed Deposits. Grow your wealth with our secure savings plans.</p>
          </div>
          <div className="feature-card">
            <h3>📈 Invest</h3>
            <p>Explore mutual funds, stocks, and other investment opportunities. (Coming Soon)</p>
          </div>
          <div className="feature-card">
            <h3>💸 Borrow</h3>
            <p>Get instant personal loans, home loans, and car loans at competitive rates. (Coming Soon)</p>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} The Digital Bank. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;