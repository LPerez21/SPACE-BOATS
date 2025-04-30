// client/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';

import RegisterPage     from './pages/RegisterPage';
import LoginPage        from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage    from './pages/DashboardPage';
import GamePage         from './pages/GamePage';
import LeaderboardPage  from './pages/LeaderboardPage';
import WelcomePage      from './pages/WelcomePage';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  import SinglePlayer     from './pages/SinglePlayer';
import CoOp             from './pages/Coop';        
import Duel             from './pages/Duel';

// This component goes inside <Router> so we can use useLocation()
function AppContent({ loggedIn, setLoggedIn }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  const hideNavbarRoutes = ['/login', '/register', '/welcome'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && (
        <NavBar loggedIn={loggedIn} onLogout={handleLogout} />
      )}

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

        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/register"    element={<RegisterPage />} />
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
    </>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <AppContent loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
    </Router>
  );
}

export default App;
