// src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AllTransactionsPage from './pages/AllTransactionsPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import './App.css'; // <-- THIS IS THE FIX
import AccountManagementPage from './pages/AccountManagementPage.jsx';
import MyRequestsPage from './pages/MyRequestsPage.jsx'; 

// --- Import Admin Components ---
import AdminRoute from './components/AdminRoute.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

// This layout is for PRIVATE pages (dashboard, settings, etc.)
const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- USER PROTECTED ROUTES --- */}
      <Route element={<ProtectedRoute />}>
        <Route 
          path="/dashboard" 
          element={<AppLayout><DashboardPage /></AppLayout>} 
        />
        <Route 
          path="/transactions" 
          element={<AppLayout><AllTransactionsPage /></AppLayout>} 
        />
        <Route 
          path="/settings" 
          element={<AppLayout><AccountManagementPage /></AppLayout>} 
        />
        <Route 
          path="/my-requests" 
          element={<AppLayout><MyRequestsPage /></AppLayout>} 
        />
      </Route>

      {/* --- ADMIN PROTECTED ROUTES --- */}
      <Route element={<AdminRoute />}>
        <Route 
          path="/admin/dashboard" 
          element={<AppLayout><AdminDashboardPage /></AppLayout>} 
        />
      </Route>
      
      {/* Fallback to the public home page */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;