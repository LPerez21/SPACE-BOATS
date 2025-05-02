import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GameData from '../components/GameData';
import Logo2 from '/logo2.png';
import useSound from 'use-sound';
import keySound from '../assets/sounds/keyboard.mp3'; // adjust path if needed

export default function SinglePlayer() {
  const navigate = useNavigate();

  // Retrieve Player 1's selected ship from localStorage
  const player1ShipIndex = parseInt(localStorage.getItem('selectedShipIndex')) || 0; // Default to 0

  // Hook to play the keyboard sound
  const [playKeySound] = useSound(keySound);

  // Listen for key press events to play sound
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Valid control keys for player1
      const validKeys = ['Space'];
      if (validKeys.includes(e.code)) {
        playKeySound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playKeySound]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <img 
        src={Logo2}
        alt="Logo"
        style={{ width: '500px', mt: '-200px', mb: '-100px' }}
      />
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: 'Press Start 2P', color: '#00ffea', textShadow: '0 0 5px #00ffea' }}
      >
        SINGLE PLAYER MODE
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
        <GameData 
          isCoOp={false}
          controls={{
            player1: { left: 'KeyA', right: 'KeyD', shoot: 'Space', color: 'lime' },
          }}
          favoriteShipIndex={[player1ShipIndex]}
        />
      </Box>

      <Button
        variant="outlined"
        sx={{
          fontFamily: 'Press Start 2P',
          color: 'lime',
          borderColor: 'lime',
          '&:hover': {
            backgroundColor: 'cyan',
            boxShadow: '0 0 10px blue, 0 0 20px blue',
            color: 'black',
          },
        }}
        onClick={() => navigate('/dashboard')}
      >
        BACK TO DASHBOARD
      </Button>
    </Container>
  );
}