import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AccountManagementRow from '../components/AccountManagementRow';
import './AccountManagementPage.css';
import { createNewAccount, updateProfile } from '../services/api';
import { useUserData } from '../hooks/useBankingData';
import { useQueryClient } from '@tanstack/react-query';
import InstallApp from '../components/InstallApp';

const AccountManagementPage = () => {
  const { user: authUser, fetchUser, logout } = useAuth(); // Add logout
  const { data: user, isLoading } = useUserData();
  const queryClient = useQueryClient();

  const [creating, setCreating] = useState(false);

  // Profile Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: ''
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAccount = async (type) => {
    setCreating(true);
    try {
      await createNewAccount(type);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      alert(`${type} account created successfully!`);
    } catch (err) {
      console.error("Failed to create account", err);
      alert("Failed to create account. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading user details...</div>;
  }

  if (!user) {
    return <div>Error loading user data.</div>;
  }

  const isAdmin = user.roles && user.roles.includes('ROLE_ADMIN');

  return (
    <div className="account-management-container">
      <InstallApp />
      <h1>Profile & Settings</h1>

      {/* --- SECTION 1: EDIT PROFILE --- */}
      <div className="settings-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Edit Profile</h2>
          {!editing ? (
            <button className="btn-outline" onClick={() => setEditing(true)}>Edit Profile</button>
          ) : (
            <button className="btn-outline" onClick={() => setEditing(false)}>Cancel</button>
          )}
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={user.username} disabled />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!editing}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!editing}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!editing}
              placeholder="Enter your address"
            />
          </div>

          <div className="form-group">
            <label>User ID</label>
            <input type="text" value={user.id} disabled />
          </div>
          <div className="form-group">
            <label>Roles</label>
            <input type="text" value={user.roles ? user.roles.join(', ') : ''} disabled />
          </div>

          {editing && (
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: '1rem' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </form>
      </div>

      {/* --- SECTION 2: MANAGE ACCOUNTS (USER ONLY) --- */}
      {!isAdmin && (
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
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
      )}

      {/* --- SECTION 3: LOG OUT BUTTON --- */}
      <div className="settings-card">
        <button
          onClick={logout}
          className="btn"
          style={{
            backgroundColor: 'var(--color-danger)',
            color: 'white',
            width: '100%'
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default AccountManagementPage;