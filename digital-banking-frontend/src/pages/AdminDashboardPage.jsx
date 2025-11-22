// src/pages/AdminDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminUserSearch from '../components/AdminUserSearch';
import AdminRollbackQueue from '../components/AdminRollbackQueue';
import AdminAllTransactions from '../components/AdminAllTransactions';
import { getUserCount } from '../services/adminApi';
import './AdminDashboardPage.css';

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
  const [currentTab, setCurrentTab] = useState('queue');
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    getUserCount()
      .then(res => setUserCount(res.data))
      .catch(err => console.error("Failed to fetch user count", err));
  }, []);

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

      {/* Stats Card */}
      <div className="admin-stats-card" style={{
        backgroundColor: 'var(--color-white)',
        padding: '1.5rem',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '2rem' }}>👥</div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-gray-dark)' }}>Total Registered Users</h3>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {userCount}
          </p>
        </div>
      </div>

      {/* Render the Tab Navigation */}
      <AdminDashboardNav currentTab={currentTab} setTab={setCurrentTab} />

      {/* Render the content for the active tab */}
      {renderTabContent()}
    </div>
  );
};

export default AdminDashboardPage;