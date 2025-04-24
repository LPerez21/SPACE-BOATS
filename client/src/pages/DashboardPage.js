import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{
        mt: 10,
        p: 4,
        border: '4px solid cyan',
        boxShadow: '0 0 20px cyan',
        textAlign: 'center',
        borderRadius: 2
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Press Start 2P', color: '#00ffcc' }}>
          🚀 WELCOME, PILOT!
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, fontFamily: 'Press Start 2P', color: '#ffcc00' }}>
          Ready to command your Space Boat?
        </Typography>

        <Button
          variant="outlined"
          sx={{ m: 2, fontFamily: 'Press Start 2P', color: 'lime', borderColor: 'lime' }}
          onClick={() => alert('Game Starting Soon...')}
        >
          START GAME
        </Button>

        <Button
          variant="outlined"
          sx={{ m: 2, fontFamily: 'Press Start 2P', color: 'cyan', borderColor: 'cyan' }}
          onClick={() => navigate('/profile')}
        >
          VIEW PROFILE
        </Button>

        <Button
          variant="outlined"
          sx={{ m: 2, fontFamily: 'Press Start 2P', color: 'red', borderColor: 'red' }}
          onClick={handleLogout}
        >
          LOG OUT
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardPage;
