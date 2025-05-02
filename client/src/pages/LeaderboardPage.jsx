import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Leaderboard from '../components/leaderboard';
import Logo2 from '/logo2.png'


export default function LeaderboardPage() {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/scores/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setScores(data);
        } else {
          console.error('Failed to fetch leaderboard');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Leaderboard scores={scores} />
      <Button
        variant="outlined"
        sx={{
          fontFamily: 'Press Start 2P',
          color: 'cyan',
          marginTop: '25px',
          borderColor: 'cyan',
          '&:hover': { backgroundColor: '#111' }
        }}
        onClick={() => navigate('/dashboard')}
      >
        BACK
      </Button>
    </Container>
  );
}
