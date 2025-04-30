// client/src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';

import RegisterPage     from './pages/RegisterPage';
import LoginPage        from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage    from './pages/DashboardPage';
import GamePage         from './pages/GamePage';
import LeaderboardPage  from './pages/LeaderboardPage';

import SinglePlayer     from './pages/SinglePlayer';
import CoOp             from './pages/Coop';        
import Duel             from './pages/Duel';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <Router>
      <NavBar loggedIn={loggedIn} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

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
          path="/singleplayer"
          element={
            loggedIn
              ? <SinglePlayer />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/coop"
          element={
            loggedIn
              ? <CoOp />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/duel"
          element={
            loggedIn
              ? <Duel />
              : <Navigate to="/login" replace />
          }
        />

        {/* Game Mode Route End */}

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
    </Router>
  );
}

export default App;
