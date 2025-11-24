// src/App.jsx

import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import RoleRoute from './components/RoleRoute.jsx';
import Navbar from './components/Navbar.jsx';
import './App.css';

// Lazy Load Components
const DashboardPage = React.lazy(() => import('./pages/DashboardPage.jsx'));
const AllTransactionsPage = React.lazy(() => import('./pages/AllTransactionsPage.jsx'));
const AccountManagementPage = React.lazy(() => import('./pages/AccountManagementPage.jsx'));
const MyRequestsPage = React.lazy(() => import('./pages/MyRequestsPage.jsx'));
const AdminDashboardPage = React.lazy(() => import('./pages/AdminDashboardPage.jsx'));
const AboutPage = React.lazy(() => import('./pages/AboutPage.jsx'));

// This layout is for PRIVATE pages (dashboard, settings, etc.)
import Sidebar from './components/Sidebar.jsx';
import BottomNav from './components/BottomNav.jsx';

const AppLayout = ({ children }) => {
  return (
    <div className="modern-layout">
      {/* 1. Sidebar stands alone (Fixed Left) */}
      <Sidebar className="desktop-sidebar" />
      {/* 2. Content Wrapper (Pushed Right) */}
      <div className="content-wrapper">
        <Navbar />
        <main className="main-content">
          <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
      {/* 3. Mobile Nav (Fixed Bottom) */}
      <BottomNav className="mobile-bottom-nav" />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- USER PROTECTED ROUTES --- */}
      <Route element={<RoleRoute roleRequired="USER" />}>
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
      <Route element={<RoleRoute roleRequired="ADMIN" />}>
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