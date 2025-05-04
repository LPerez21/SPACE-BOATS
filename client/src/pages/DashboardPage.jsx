// client/src/pages/DashboardPage.jsx

import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import Leaderboard from '../components/Leaderboard';
import DashboardHeading from '../components/DashboardHeading';

export default function DashboardPage() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await fetch('/api/scores/leaderboard');
        if (!res.ok) {
          // Try parsing JSON error, fall back to text
          let err;
          try { err = await res.json(); }
          catch { err = { detail: await res.text() }; }
          console.error('Leaderboard fetch failed:', err);
          return;
        }
        const data = await res.json();
        // Only set if it's an array
        if (Array.isArray(data)) {
          setScores(data);
        } else {
          console.warn('Expected array but got:', data);
        }
      } catch (err) {
        console.error('Network error loading leaderboard:', err);
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <Container maxWidth="md">
      <DashboardHeading />
      {/* Pass an empty array if scores isn’t ready */}
      <Leaderboard scores={Array.isArray(scores) ? scores : []} />
    </Container>
  );
}
