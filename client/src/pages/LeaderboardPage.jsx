import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Leaderboard from '../components/leaderboard';

export default function LeaderboardPage() {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/scores/leaderboard')
      .then(res => res.json())
      .then(setScores)
      .catch(console.error);
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
