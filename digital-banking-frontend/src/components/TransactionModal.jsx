// src/components/TransactionModal.jsx

import React, { useState } from 'react';
import Modal from './Modal';
// Import BOTH user and admin APIs
import { makeDeposit, makeWithdrawal, makeTransfer } from '../services/api';
import { adminMakeDeposit, adminMakeWithdraw, adminMakeTransfer } from '../services/adminApi';
import { formatCurrency } from '../utils/formatters';
import './TransactionModal.css';

// 1. Add new prop 'isAdminMode', default to false
const TransactionModal = ({ mode, account, onClose, onSuccess, isAdminMode = false }) => {
  const [amount, setAmount] = useState('');
  const [targetAccountNumber, setTargetAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const titles = {
    deposit: `Deposit to ${account.type}`,
    withdraw: `Withdraw from ${account.type}`,
    transfer: `Transfer from ${account.type}`,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Please enter a valid amount.');
      }

      // 2. Use the correct API based on isAdminMode
      if (mode === 'deposit') {
        isAdminMode 
          ? await adminMakeDeposit(account.id, parsedAmount)
          : await makeDeposit(account.id, parsedAmount);
      } else if (mode === 'withdraw') {
        isAdminMode
          ? await adminMakeWithdraw(account.id, parsedAmount)
          : await makeWithdrawal(account.id, parsedAmount);
      } else if (mode === 'transfer') {
        if (!targetAccountNumber) throw new Error('Please enter a target account number.');
        isAdminMode
          ? await adminMakeTransfer(account.id, targetAccountNumber, parsedAmount)
          : await makeTransfer(account.id, targetAccountNumber, parsedAmount);
      }

      console.log('Transaction successful (Admin: ' + isAdminMode + ')');
      onSuccess(); // This will close the modal and refresh data

    } catch (err) {
      console.error('Transaction failed:', err);
      setError(err.response?.data?.message || err.message || 'Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={titles[mode]} isOpen={true} onClose={onClose}>
      <form onSubmit={handleSubmit} className="transaction-form">
        <p className="form-subtitle">
          Account: {account.accountNumber}
        </p>
        <p className="form-subtitle" style={{marginTop: 0, fontWeight: 600}}>
          Balance: {formatCurrency(account.balance)}
        </p>

        {mode === 'transfer' && (
          <div className="form-group">
            <label htmlFor="targetAccount">Target Account Number</label>
            <input
              type="text"
              id="targetAccount"
              value={targetAccountNumber}
              onChange={(e) => setTargetAccountNumber(e.target.value)}
              placeholder="e.g., ACC123456789"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <div className="amount-input-wrapper">
            <span className="amount-prefix">₹</span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="form-submit-btn" disabled={loading}>
          {loading ? 'Processing...' : `Submit ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
        </button>
      </form>
    </Modal>
  );
};

export default TransactionModal;