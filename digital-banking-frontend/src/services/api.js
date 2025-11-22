// src/services/api.js

import axios from 'axios';

const API_URL = 'https://digital-banking-fullstack.onrender.com/api';

// --- THIS IS THE FIX (Part 1) ---
// We create 'api' and immediately export it as a named constant
export const api = axios.create({
  baseURL: API_URL,
});
// --- END OF FIX ---

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth Service Calls ---
export const loginUser = (username, password) => {
  return api.post('/auth/login', { username, password });
};
export const registerUser = (username, password) => {
  return api.post('/auth/register', { username, password });
};

// --- User Service Calls ---
export const getCurrentUser = () => {
  return api.get('/user/accounts/me');
};
export const getMyRequests = () => {
  return api.get('/api/user/requests');
};
export const requestRollback = (transactionId, reason) => {
  return api.post(`/user/requests/rollback/${transactionId}`, { reason });
};

// --- Account Service Calls ---
export const getUserAccounts = () => {
  return api.get('/user/accounts');
};
export const createNewAccount = (accountType) => {
  return api.post('/user/accounts', { type: accountType });
};
export const selectUserAccount = (accountId) => {
  return api.post(`/user/accounts/select/${accountId}`);
};
export const activateAccount = (accountId) => {
  return api.post(`/user/accounts/activate/${accountId}`);
};
export const deactivateAccount = (accountId) => {
  return api.post(`/user/accounts/deactivate/${accountId}`);
};

// --- NEW: Lookup Account ---
export const lookupAccount = (username) => {
  return api.get(`/user/accounts/lookup/${username}`);
};

// --- Transaction Service Calls ---
export const getMyTransactions = () => {
  return api.get('/user/transactions/my-history');
};
export const makeDeposit = (accountId, amount) => {
  return api.post('/user/transactions/deposit', { accountId, amount });
};
export const makeWithdrawal = (accountId, amount) => {
  return api.post('/user/transactions/withdraw', { accountId, amount });
};
export const makeTransfer = (sourceAccountId, targetAccountNumber, amount) => {
  return api.post('/user/transactions/transfer', { 
    sourceAccountId, 
    targetAccountNumber,
    amount 
  });
};