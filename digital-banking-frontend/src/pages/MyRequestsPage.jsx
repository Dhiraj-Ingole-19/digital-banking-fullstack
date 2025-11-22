// src/pages/MyRequestsPage.jsx

import React, { useState, useEffect } from 'react';
import { getMyRequests } from '../services/api';
import { formatDateTime } from '../utils/formatters';
import './MyRequestsPage.css';

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "My Requests | The Digital Bank";
    setLoading(true);
    getMyRequests()
      .then(response => {
        console.log("Requests fetched:", response.data);
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

  const getStatusBadge = (status) => {
    let color = '#6c757d'; // Default gray
    if (status === 'APPROVED') color = '#28a745'; // Green
    if (status === 'REJECTED') color = '#dc3545'; // Red
    if (status === 'PENDING') color = '#ffc107'; // Yellow

    return (
      <span style={{
        backgroundColor: color,
        color: status === 'PENDING' ? 'black' : 'white',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 'bold'
      }}>
        {status}
      </span>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div>Loading your requests...</div>;
    }
    if (error) {
      return <p className="form-error">{error}</p>;
    }
    if (!requests || requests.length === 0) {
      return (
        <div className="empty-state-small">
          <p>You have not submitted any requests.</p>
        </div>
      );
    }
    return (
      <div className="request-list" style={{ display: 'grid', gap: '1rem' }}>
        {requests.map(req => (
          <div key={req.id} className="request-card" style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div className="request-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Request for Tx ID: {req.transactionId}</h3>
              {getStatusBadge(req.status)}
            </div>
            <p className="request-card-reason" style={{ margin: '0.5rem 0', color: '#555' }}>
              <strong>Reason:</strong> {req.reason}
            </p>
            <span className="request-card-date" style={{ fontSize: '0.85rem', color: '#888' }}>
              Submitted: {formatDateTime(req.createdAt)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="my-requests-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>My Submitted Requests</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>Track the status of your transaction reports here.</p>
      {renderContent()}
    </div>
  );
};

export default MyRequestsPage;