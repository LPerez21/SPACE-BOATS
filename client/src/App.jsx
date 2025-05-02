import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';

import WelcomePage from './pages/WelcomePage';
import GamePlay from './pages/GamePlay';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };
  const hideNavbarRoutes = ['/login', '/register', '/welcome'];

  return (
    <Router>
        <NavBarWrapper
        loggedIn={loggedIn}
        onLogout={handleLogout}
        hideNavbarRoutes={hideNavbarRoutes}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<WelcomePage />} />

        <Route
          path="/game"
          element={
            loggedIn
              ? <GamePage />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/dashboard"
          element={
            loggedIn
              ? <DashboardPage />
              : <Navigate to="/login" replace />
          }
        />

        {/* Game Mode Route Start */}

        <Route
          path="/gameplay"
          element={
            loggedIn
              ? <GamePlay />
              : <Navigate to="/login" replace />
          }
        />

        {/* Game Mode Route End */}

        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/login"
          element={<LoginPage onLogin={() => setLoggedIn(true)} />}
        />
        <Route
          path="/profile"
          element={
            loggedIn
              ? <ProfileSetupPage />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="*"
          element={<div style={{ padding: 20 }}>❌ Page not found</div>}
        />
      </Routes>
    </Router>
  );
}

function NavBarWrapper({ loggedIn, onLogout, hideNavbarRoutes }) {
  const location = useLocation(); // Get the current route

  return !hideNavbarRoutes.includes(location.pathname) ? (
    <NavBar loggedIn={loggedIn} onLogout={onLogout} />
  ) : null;
}

export default App;