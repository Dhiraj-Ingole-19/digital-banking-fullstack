// src/pages/MyRequestsPage.jsx

import React, { useState, useEffect } from 'react';
import { getMyRequests } from '../services/api';
import { formatDateTime } from '../utils/formatters';
import './MyRequestsPage.css'; // We'll create this next

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "My Requests | The Digital Bank";
    setLoading(true);
    getMyRequests()
      .then(response => {
        setRequests(response.data);
      })
      .catch(err => {
        console.error("Failed to fetch requests:", err);
        setError("Could not load your requests.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getStatusClass = (status) => {
    if (status === 'APPROVED') return 'status-active';
    if (status === 'REJECTED') return 'status-inactive';
    return 'status-pending';
  };

  const renderContent = () => {
    if (loading) {
      return <div>Loading your requests...</div>;
    }
    if (error) {
      return <p className="form-error">{error}</p>;
    }
    if (requests.length === 0) {
      return (
        <div className="empty-state-small">
          <p>You have not submitted any requests.</p>
        </div>
      );
    }
    return (
      <div className="request-list">
        {requests.map(req => (
          <div key={req.id} className="request-card">
            <div className="request-card-header">
              <h3>Request for Tx ID: {req.transactionId}</h3>
              <span className={`status ${getStatusClass(req.status)}`}>
                {req.status}
              </span>
            </div>
            <p className="request-card-reason">
              <strong>Your Reason:</strong> {req.reason}
            </p>
            <span className="request-card-date">
              Submitted: {formatDateTime(req.createdAt)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="my-requests-container">
      <h1>My Submitted Requests</h1>
      <p>Track the status of your transaction reports here.</p>
      {renderContent()}
    </div>
  );
};

export default MyRequestsPage;