/**
 * Main App Component
 * Root component with routing and global providers
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { AssistantProvider } from './contexts/AssistantContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Eager load auth pages (small, needed immediately)
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Styles
import './App.css';
import './theme.css';

// Lazy load main app pages (larger, only needed after auth)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.2rem',
    color: 'var(--text-primary)'
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AssistantProvider>
          <Router>
            <div className="App">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Route>
                </Route>

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
                pauseOnHover
              />
            </div>
          </Router>
        </AssistantProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
