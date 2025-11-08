// src/components/TransactionItem.jsx
import React, { useState } from 'react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
// 1. IMPORT THE NEW MODAL
import ReportModal from './ReportModal';
import './TransactionItem.css';

const TransactionItem = ({ transaction, userAccountIds }) => {
  // 2. State to control the modal
  const [isReporting, setIsReporting] = useState(false);
  const [isReported, setIsReported] = useState(transaction.reported); // We need to add this to the DTO

  // ... (logic for isDebit and description is unchanged) ...
  let isDebit = false;
  // ... (rest of logic) ...

  // 3. This is called when the modal submits successfully
  const handleReportSuccess = () => {
    setIsReporting(false);
    setIsReported(true); // Visually disable the button
    alert("Transaction reported successfully.");
  };

  return (
    <>
      <div className="tx-item">
        {/* ... (icon, details, amount are unchanged) ... */}

        {/* 4. Update the "Report" button logic */}
        {(isDebit || transaction.type === 'DEPOSIT') && ( // Allow reporting deposits
          <div className="tx-report-action">
            <button 
              className="btn-report" 
              onClick={() => setIsReporting(true)} // Open the modal
              disabled={isReported} // Disable if already reported
            >
              {isReported ? 'Reported' : 'Report'}
            </button>
          </div>
        )}
      </div>
      
      {/* 5. Render the modal (it's hidden by default) */}
      {isReporting && (
        <ReportModal
          transaction={transaction}
          onClose={() => setIsReporting(false)}
          onSuccess={handleReportSuccess}
        />
      )}
    </>
  );
};

export default TransactionItem;