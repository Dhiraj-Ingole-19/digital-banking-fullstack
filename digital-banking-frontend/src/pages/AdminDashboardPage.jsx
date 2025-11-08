// src/pages/AdminDashboardPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminUserSearch from '../components/AdminUserSearch';
import AdminRollbackQueue from '../components/AdminRollbackQueue';
import AdminAllTransactions from '../components/AdminAllTransactions';
import './AdminDashboardPage.css'; // This file now gets new tab styles

// This is our Tab Navigation
const AdminDashboardNav = ({ currentTab, setTab }) => {
  return (
    <nav className="admin-nav-tabs">
      <button 
        className={currentTab === 'queue' ? 'active' : ''}
        onClick={() => setTab('queue')}
      >
        Rollback Queue
      </button>
      <button 
        className={currentTab === 'users' ? 'active' : ''}
        onClick={() => setTab('users')}
      >
        User Management
      </button>
      <button 
        className={currentTab === 'transactions' ? 'active' : ''}
        onClick={() => setTab('transactions')}
      >
        All Transactions
      </button>
    </nav>
  );
};


const AdminDashboardPage = () => {
  const { user: adminUser } = useAuth(); 
  const [currentTab, setCurrentTab] = useState('queue'); // Default to the queue

  // This function conditionally renders the correct component
  const renderTabContent = () => {
    switch (currentTab) {
      case 'users':
        return <AdminUserSearch />;
      case 'transactions':
        return <AdminAllTransactions />;
      case 'queue':
      default:
        return <AdminRollbackQueue />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {adminUser.username}. Manage users and transactions.</p>
      </div>

      {/* Render the Tab Navigation */}
      <AdminDashboardNav currentTab={currentTab} setTab={setCurrentTab} />
      
      {/* Render the content for the active tab */}
      {renderTabContent()}
    </div>
  );
};

export default AdminDashboardPage;