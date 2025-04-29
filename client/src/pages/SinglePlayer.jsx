import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GameData from '../components/GameData';

export default function SinglePlayer() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: 'Press Start 2P', color: '#00ffea', textShadow: '0 0 5px #00ffea' }}
      >
        SPACE BOATS - SINGLE PLAYER
      </Typography>

      <Box
        sx={{
          width: '100%',
          height: 400,
          border: '3px solid cyan',
          boxShadow: '0 0 20px cyan',
          backgroundColor: 'black',
          mb: 2,
        }}
      >
        {/* Mount the GameData component for single-player mode */}
        <GameData isCoOp={false} />
      </Box>

      <Button
        variant="outlined"
        sx={{
          fontFamily: 'Press Start 2P',
          color: 'lime',
          borderColor: 'lime',
          '&:hover': { backgroundColor: '#111' },
        }}
        onClick={() => navigate('/dashboard')}
      >
        BACK TO DASHBOARD
      </Button>
    </Container>
  );
}