// client/src/pages/DashboardPage.js

import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import Leaderboard from '../components/leaderboard';
import DashboardHeading from '../components/dashboardHeading';

export default function DashboardPage() {

  const [scores, setScores] = useState([]);

  // Fetch leaderboard on mount
  React.useEffect(() => {
    fetch('http://localhost:8000/scores/leaderboard')
      .then(res => res.json())
      .then(data => setScores(data))
      .catch(err => console.error('Failed loading leaderboard', err));
  }, []);

  return (
    <Container maxWidth="md">
      <DashboardHeading />
      <Leaderboard scores={scores} />
    </Container>
  );
}
