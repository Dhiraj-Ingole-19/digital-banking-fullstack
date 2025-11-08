// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthLoading } = useAuth(); // Get isAuthLoading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 1. The login function now returns the user object
      const user = await login(username, password);

      // 2. Check the user object for roles
      if (user) {
        if (user.roles && user.roles.includes('ROLE_ADMIN')) {
          navigate('/admin/dashboard'); // Redirect Admin
        } else {
          navigate('/dashboard'); // Redirect User
        }
      } else {
        // This case handles if fetchUser failed
        setError('Login successful, but failed to fetch user details.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password. Please try again.');
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-header">Welcome Back!</h1>
        <p className="auth-subheader">Please log in to your account.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* ... (form-group username) ... */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isAuthLoading} // Disable form while logging in
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isAuthLoading} // Disable form while logging in
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button" disabled={isAuthLoading}>
            {isAuthLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch-link">
          Don't have an account?
          <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;