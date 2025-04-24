// client/src/pages/DashboardPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 10,
          p: 4,
          border: '4px solid cyan',
          boxShadow: '0 0 20px cyan',
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: '#000'
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: 'Press Start 2P',
            color: '#00ffcc',
            textShadow: '0 0 5px #00ffcc'
          }}
        >
          🚀 WELCOME, PILOT!
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            fontFamily: 'Press Start 2P',
            color: '#ffcc00',
            textShadow: '0 0 3px #ffcc00'
          }}
        >
          Ready to command your Space Boat?
        </Typography>

        <Button
          variant="outlined"
          sx={{
            m: 2,
            fontFamily: 'Press Start 2P',
            color: 'lime',
            borderColor: 'lime',
            '&:hover': { backgroundColor: '#111' }
          }}
          onClick={() => navigate('/game')}
        >
          START GAME
        </Button>

        <Button
          variant="outlined"
          sx={{
            m: 2,
            fontFamily: 'Press Start 2P',
            color: 'cyan',
            borderColor: 'cyan',
            '&:hover': { backgroundColor: '#111' }
          }}
          onClick={() => navigate('/profile')}
        >
          VIEW PROFILE
        </Button>

        <Button
          variant="outlined"
          sx={{
            m: 2,
            fontFamily: 'Press Start 2P',
            color: 'red',
            borderColor: 'red',
            '&:hover': { backgroundColor: '#111' }
          }}
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          LOG OUT
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardPage;
