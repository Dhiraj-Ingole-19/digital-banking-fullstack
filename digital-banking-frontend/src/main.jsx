// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// THIS IS THE FIX:
// We are importing 'AuthProvider' as the default export (no curly braces)
// to match the change we made in AuthContext.jsx
import AuthProvider from './context/AuthContext.jsx';

import App from './App.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);