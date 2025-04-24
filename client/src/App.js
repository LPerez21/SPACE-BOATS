import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';  // 👈 Import Dashboard

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <nav style={{ padding: 16 }}>
        <Link to="/dashboard" style={{ marginRight: 8 }}>Dashboard</Link>
        <Link to="/register" style={{ marginRight: 8 }}>Register</Link>
        <Link to="/login" style={{ marginRight: 8 }}>Login</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          loggedIn ? <DashboardPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage onLogin={() => setLoggedIn(true)} />} />
        <Route
          path="/profile"
          element={
            loggedIn
              ? <ProfileSetupPage />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<div style={{ padding: 20 }}>❌ Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
