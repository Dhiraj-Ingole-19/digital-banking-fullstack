// src/pages/DashboardPage.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createNewAccount } from '../services/api';
import AccountSelector from '../components/AccountSelector';
import AccountSwitchModal from '../components/AccountSwitchModal'; // <-- Re-import
import BalanceCard from '../components/BalanceCard';
import QuickActions from '../components/QuickActions';
import TransactionModal from '../components/TransactionModal'; 
import TransactionHistory from '../components/TransactionHistory';
import SavingsPromo from '../components/SavingsPromo';

import './Dashboard.css';

const DashboardPage = () => {
  const { user, fetchUser, selectAccount } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); 
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false); // <-- Re-add state
  const [showHistory, setShowHistory] = useState(false);
  const [historyKey, setHistoryKey] = useState(user?.selectedAccountId || 1);

  const selectedAccount = useMemo(() => {
    if (!user || !user.accounts) return null;
    return user.accounts.find(acc => acc.id === user.selectedAccountId);
  }, [user]);

  useEffect(() => {
    if (user && !selectedAccount && user.accounts && user.accounts.length > 0) {
      selectAccount(user.accounts[0].id);
    }
  }, [user, selectedAccount, selectAccount]);
  
  useEffect(() => {
    if (user?.selectedAccountId) {
      setHistoryKey(user.selectedAccountId);
      setShowHistory(false);
    }
  }, [user?.selectedAccountId]);

  const handleCreateAccount = async (accountType) => {
    setLoading(true);
    setError('');
    try {
      await createNewAccount(accountType);
      await fetchUser();
    } catch (err) {
      console.error('Failed to create account:', err);
      setError(`Error: ${err.response?.data?.message || 'Could not create account'}`);
    } finally {
      setLoading(false);
    }
  };

  const onTransactionSuccess = () => {
    setModal(null);
    fetchUser();
    setShowHistory(true);
    setHistoryKey(Date.now()); // This forces the refresh
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }
    
  if (user.accounts.length === 0) {
     return (
        <div className="empty-state">
          <div className="empty-state-icon">🏦</div>
          <h1>Welcome, {user.username}!</h1>
          <p>You don't have any accounts yet. Create one to get started.</p>
          <div className="account-actions" style={{justifyContent: 'center'}}>
            <button 
              className="btn btn-success" 
              onClick={() => handleCreateAccount('SAVINGS')}
              disabled={loading}
            >
              {loading ? 'Creating...' : '+ Create Savings Account'}
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => handleCreateAccount('CURRENT')}
              disabled={loading}
            >
              {loading ? 'Creating...' : '+ Create Current Account'}
            </button>
          </div>
          {error && <p className="auth-error" style={{marginTop: '1rem'}}>{error}</p>}
        </div>
      );
  }

  if (!selectedAccount) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="dashboard-container">
      
      <AccountSelector 
        selectedAccount={selectedAccount} 
        onSwitchAccount={() => setIsSwitchModalOpen(true)} // <-- Re-add prop
      />

      <BalanceCard 
        account={selectedAccount} 
      />
      
      <QuickActions 
        onDeposit={() => setModal('deposit')}
        onWithdraw={() => setModal('withdraw')}
        onTransfer={() => setModal('transfer')}
      />
      
      <SavingsPromo />

      <div className="transaction-history-toggle">
        <button 
          className="btn-outline" 
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? 'Hide' : 'Show'} Transaction History
        </button>
      </div>
      
      {showHistory && (
        <TransactionHistory 
          key={historyKey} 
          accountId={selectedAccount.id} 
        />
      )}

      {/* --- Re-add the Switch Modal --- */}
      <AccountSwitchModal 
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
      />

      {modal && (
        <TransactionModal
          mode={modal}
          account={selectedAccount}
          onClose={() => setModal(null)}
          onSuccess={onTransactionSuccess}
        />
      )}
    </div>
  );
};

export default DashboardPage;