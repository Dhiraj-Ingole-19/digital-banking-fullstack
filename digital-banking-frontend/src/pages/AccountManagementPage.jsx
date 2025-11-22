// src/pages/AccountManagementPage.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import AccountManagementRow from '../components/AccountManagementRow';
import './AccountManagementPage.css';
import { Link } from 'react-router-dom';

const AccountManagementPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="loading-spinner">Loading user details...</div>;
  }

  return (
    <div className="account-management-container">
      <h1>Profile & Settings</h1>

      {/* --- SECTION 1: USER PROFILE --- */}
      <div className="settings-card">
        <h2>User Profile</h2>
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={user.username} disabled />
        </div>
        <div className="form-group">
          <label>User ID</label>
          <input type="text" value={user.id} disabled />
        </div>
        <div className="form-group">
          <label>Roles</label>
          <input type="text" value={user.roles ? user.roles.join(', ') : ''} disabled />
        </div>
      </div>

      {/* --- 2. NEW: "MY REQUESTS" SECTION --- */}
      <div className="settings-card">
        <h2>My Support Requests</h2>
        <p>Track the status of your reported transactions and support tickets.</p>
        <Link to="/my-requests" className="btn-primary-link" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none', color: 'var(--color-primary)', fontWeight: 'bold' }}>
          View My Requests &rarr;
        </Link>
      </div>

      {/* --- SECTION 3: ACCOUNT MANAGEMENT --- */}
      <div className="settings-card">
        <h2>Manage Accounts</h2>
        <p>Activate, deactivate, or set your default account.</p>
        <div className="account-management-list">
          {user.accounts && user.accounts.length > 0 ? (
            user.accounts.map(account => (
              <AccountManagementRow key={account.id} account={account} />
            ))
          ) : (
            <p>No accounts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountManagementPage;