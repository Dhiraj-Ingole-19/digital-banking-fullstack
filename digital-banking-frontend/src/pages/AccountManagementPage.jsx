// src/pages/AccountManagementPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AccountManagementRow from '../components/AccountManagementRow';
import './AccountManagementPage.css';
import { Link } from 'react-router-dom';
import { createNewAccount } from '../services/api';

const AccountManagementPage = () => {
  const { user, fetchUser } = useAuth();
  const [creating, setCreating] = useState(false);

  if (!user) {
    return <div className="loading-spinner">Loading user details...</div>;
  }

  const isAdmin = user.roles && user.roles.includes('ROLE_ADMIN');

  const handleCreateAccount = async (type) => {
    setCreating(true);
    try {
      await createNewAccount(type);
      await fetchUser(); // Refresh user data
      alert(`${type} account created successfully!`);
    } catch (err) {
      console.error("Failed to create account", err);
      alert("Failed to create account. Please try again.");
    } finally {
      setCreating(false);
    }
  };

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

      {/* --- SECTIONS 2 & 3: HIDE IF ADMIN --- */}
      {!isAdmin && (
        <>
          {/* --- 2. NEW: "MY REQUESTS" SECTION --- */}
          <div className="settings-card">
            <h2>My Support Requests</h2>
            <p>Track the status of your reported transactions and support tickets.</p>
            <Link to="/my-requests" className="btn btn-primary" style={{ marginTop: '1rem' }}>
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

            {/* --- NEW: Open Account Buttons --- */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-success"
                onClick={() => handleCreateAccount('SAVINGS')}
                disabled={creating}
              >
                {creating ? 'Creating...' : '+ Open Savings Account'}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleCreateAccount('CURRENT')}
                disabled={creating}
              >
                {creating ? 'Creating...' : '+ Open Current Account'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountManagementPage;