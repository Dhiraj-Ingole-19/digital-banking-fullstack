// src/components/QuickActions.jsx

import React from 'react';
import './QuickActions.css';

// This is now a "dumb" component. It just reports clicks.
const QuickActions = ({ onDeposit, onWithdraw, onTransfer }) => {
  return (
    <div className="quick-actions-container">
      <button className="action-btn" onClick={onDeposit}>
        <span>Deposit</span>
      </button>
      <button className="action-btn" onClick={onWithdraw}>
        <span>Withdraw</span>
      </button>
      <button className="action-btn" onClick={onTransfer}>
        <span>Transfer</span>
      </button>
    </div>
  );
};

export default QuickActions;