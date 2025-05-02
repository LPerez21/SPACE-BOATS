import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GameData from '../components/GameData';
import Logo2 from '/logo2.png';
import keySound from '../assets/sounds/keyboard.mp3';
import KeyboardSoundListener from '../components/KeyboardSoundListener';

export default function SinglePlayer() {
  const navigate = useNavigate();

  // Retrieve Player 1's selected ship from localStorage
  const player1ShipIndex = parseInt(localStorage.getItem('selectedShipIndex')) || 0; // Default to 0

  return (
    <KeyboardSoundListener sound={keySound} validKeys={['Space']}>
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
    </KeyboardSoundListener>
  );
}