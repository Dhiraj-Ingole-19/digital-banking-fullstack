// src/pages/AdminDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminUserSearch from '../components/AdminUserSearch';
import AdminRollbackQueue from '../components/AdminRollbackQueue';
import AdminAllTransactions from '../components/AdminAllTransactions';
import { getUserCount, getAllUsers } from '../services/adminApi';
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
  const [loadingCount, setLoadingCount] = useState(true);
  const [showUserList, setShowUserList] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (adminUser?.roles?.includes('ROLE_ADMIN')) {
      getUserCount()
        .then(res => setUserCount(res.data))
        .catch(err => console.error("Failed to fetch user count", err))
        .finally(() => setLoadingCount(false));
    } else {
      setLoadingCount(false);
    }
  }, [adminUser]);

  // Back Button Guard
  useEffect(() => {
    const handlePopState = (event) => {
      const confirmLeave = window.confirm("Are you sure you want to leave? You will be logged out.");
      if (!confirmLeave) {
        window.history.pushState(null, "", window.location.pathname);
      }
    };
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleToggleUserList = async () => {
    if (!showUserList) {
      setLoadingUsers(true);
      try {
        const res = await getAllUsers();
        setAllUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoadingUsers(false);
      }
    }
    setShowUserList(!showUserList);
  };

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
            {loadingCount ? 'Loading...' : userCount}
          </p>
        </div>

        <button
          className="btn-outline"
          style={{ marginLeft: 'auto' }}
          onClick={handleToggleUserList}
        >
          {showUserList ? 'Hide User List' : 'View User List'}
        </button>
      </div>

      {/* User List Table */}
      {showUserList && (
        <div className="admin-section" style={{ marginBottom: '1.5rem' }}>
          <h3>All Users</h3>
          {loadingUsers ? <p>Loading users...</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '0.5rem' }}>ID</th>
                    <th style={{ padding: '0.5rem' }}>Username</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '0.5rem' }}>{u.id}</td>
                      <td style={{ padding: '0.5rem' }}>{u.username}</td>
                      <td style={{ padding: '0.5rem' }}>
                        <span className={`status ${u.enabled ? 'status-active' : 'status-inactive'}`}>
                          {u.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Render the Tab Navigation */}
      <AdminDashboardNav currentTab={currentTab} setTab={setCurrentTab} />

      {/* Render the content for the active tab */}
      {renderTabContent()}
    </div>
  );
};

export default AdminDashboardPage;