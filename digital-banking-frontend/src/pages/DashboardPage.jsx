// src/pages/DashboardPage.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createNewAccount } from '../services/api';
import AccountSelector from '../components/AccountSelector';
import AccountSwitchModal from '../components/AccountSwitchModal';
import BalanceCard from '../components/BalanceCard';
import QuickActions from '../components/QuickActions';
import TransactionModal from '../components/TransactionModal';
import TransactionHistory from '../components/TransactionHistory';
import OffersCarousel from '../components/OffersCarousel';
import { useBackGuard } from '../hooks/useBackGuard';
import { useUserData } from '../hooks/useBankingData';
import { useQueryClient } from '@tanstack/react-query';

import './Dashboard.css';

const DashboardPage = () => {
  useBackGuard();
  const { user: authUser, selectAccount } = useAuth(); // Use authUser for initial state if needed, but rely on query data
  const { data: user, isLoading: isUserLoading } = useUserData();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // We can derive selectedAccount from the user data and the selectedAccountId in auth context
  // Or better, if the backend returns the selected state, we use that.
  // For now, let's assume we still rely on authUser.selectedAccountId for the ID, but get the account details from 'user' data.

  const selectedAccount = useMemo(() => {
    if (!user || !user.accounts || !authUser) return null;
    return user.accounts.find(acc => acc.id === authUser.selectedAccountId);
  }, [user, authUser]);

  useEffect(() => {
    if (user && !selectedAccount && user.accounts && user.accounts.length > 0) {
      selectAccount(user.accounts[0].id);
    }
  }, [user, selectedAccount, selectAccount]);

  const handleCreateAccount = async (accountType) => {
    setLoading(true);
    setError('');
    try {
      await createNewAccount(accountType);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (err) {
      console.error('Failed to create account:', err);
      setError(`Error: ${err.response?.data?.message || 'Could not create account'}`);
    } finally {
      setLoading(false);
    }
  };

  const onTransactionSuccess = () => {
    setModal(null);
    queryClient.invalidateQueries({ queryKey: ['user'] });
    setShowHistory(true);
  };

  if (isUserLoading) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>Error loading user data.</div>;
  }

  if (user.accounts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🏦</div>
        <h1>Welcome, {user.username}!</h1>
        <p>You don't have any accounts yet. Create one to get started.</p>
        <div className="account-actions" style={{ justifyContent: 'center' }}>
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
        {error && <p className="auth-error" style={{ marginTop: '1rem' }}>{error}</p>}
      </div>
    );
  }

  if (!selectedAccount) {
    return <div>Select an account to view details.</div>;
  }

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  return (
    <div className="dashboard-container">

      <AccountSelector
        selectedAccount={selectedAccount}
        onSwitchAccount={() => setIsSwitchModalOpen(true)}
      />

      <BalanceCard
        account={selectedAccount}
      />

      <QuickActions
        onDeposit={() => setModal('deposit')}
        onWithdraw={() => setModal('withdraw')}
        onTransfer={() => setModal('transfer')}
        isAdmin={isAdmin}
      />

      <OffersCarousel />

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
          accountId={selectedAccount.id}
        />
      )}

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
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default DashboardPage;