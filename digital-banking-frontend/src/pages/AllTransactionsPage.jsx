// src/pages/AllTransactionsPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyTransactions } from '../services/api';
import TransactionItem from '../components/TransactionItem';
import { Link } from 'react-router-dom';
import './AllTransactionsPage.css'; // We will create this next

const AllTransactionsPage = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Create the Set of account IDs to pass to our smart component
  const userAccountIds = useMemo(() => 
    new Set(user?.accounts?.map(acc => acc.id) || [])
  , [user?.accounts]);

  useEffect(() => {
    document.title = "All Transactions | Digital Bank"; // Set the page title
    
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getMyTransactions();
        // Just sort them, no filtering needed
        const sorted = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAllTransactions(sorted);
      } catch (err) {
        console.error("Failed to fetch all transactions:", err);
        setError('Could not load transaction history.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []); // Empty array means this runs only once on page load

  return (
    <div className="all-transactions-container">
      <div className="all-transactions-header">
        <h1>All Transactions</h1>
        <Link to="/dashboard" className="btn-outline-back">
          &larr; Back to Dashboard
        </Link>
      </div>

      {loading && <div>Loading all transactions...</div>}
      {error && <p className="form-error">{error}</p>}
      
      {!loading && !error && (
        <>
          {allTransactions.length === 0 ? (
            <div className="empty-state-small">
              <p>You have not made any transactions yet.</p>
            </div>
          ) : (
            <div className="transaction-list">
              {allTransactions.map(tx => (
                <TransactionItem 
                  key={tx.id} 
                  transaction={tx} 
                  userAccountIds={userAccountIds} 
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllTransactionsPage;