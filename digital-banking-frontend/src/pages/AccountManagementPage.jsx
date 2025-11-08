// src/pages/AccountManagementPage.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import AccountManagementRow from '../components/AccountManagementRow';
import './AccountManagementPage.css';
import { Link } from 'react-router-dom'; // <-- 1. IMPORT LINK

const AccountManagementPage = () => {
  // ... (user check and profileDetails are unchanged) ...
  const { user } = useAuth();
  if (!user) {
    return <div>Loading user details...</div>;
  }
  const profileDetails = {
    name: user.username,
    dob: '01/01/1990',
    address: '123 Bank St, Mumbai',
  };

  return (
    <div className="account-management-container">
      <h1>Profile & Settings</h1>

      {/* --- SECTION 1: USER PROFILE --- */}
      <div className="settings-card">
        {/* ... (profile details are unchanged) ... */}
      </div>

      {/* --- 2. NEW: "MY REQUESTS" SECTION --- */}
      <div className="settings-card">
        <h2>My Support Requests</h2>
        <p>Track the status of your reported transactions and support tickets.</p>
        <Link to="/my-requests" className="btn-primary-link">
          View My Requests
        </Link>
      </div>

      {/* --- SECTION 3: ACCOUNT MANAGEMENT --- */}
      <div className="settings-card">
        {/* ... (account management is unchanged) ... */}
      </div>
    </div>
  );
};

export default AccountManagementPage;