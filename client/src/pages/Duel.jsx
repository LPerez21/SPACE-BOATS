import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import GameData from '../components/GameData';
import Logo2 from '/logo2.png'
import { useNavigate } from 'react-router-dom';
import keySound from '../assets/sounds/keyboard.mp3';
import KeyboardSoundListener from '../components/KeyboardSoundListener';
import playerAssets from '../../images/playerAssets';

export default function Duel() {
  const navigate = useNavigate();

  // Retrieve Player 1's selected ship from localStorage
  const player1ShipIndex = parseInt(localStorage.getItem('selectedShipIndex')) || 0; // Default to 0

  // Randomly assign a ship to Player 2
  const player2ShipIndex = Math.floor(Math.random() * playerAssets.length);

  return (
    <KeyboardSoundListener sound={keySound} validKeys={['Space', 'Slash']}>
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
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
          DUEL MODE
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            mt: 4,
          }}
        >
          {/* Player 1 */}
          <Box
            sx={{
              width: '50%',
              height: 400,
              border: '3px solid lime',
              boxShadow: '0 0 20px lime',
              backgroundColor: 'black',
            }}
          >
            <GameData
              isCoOp={false}
              controls={{
                player1: { left: 'KeyA', right: 'KeyD', shoot: 'Space', color: 'lime' },
              }}
              favoriteShipIndex={[player1ShipIndex]}
            />
          </Box>

          {/* Player 2 */}
          <Box
            sx={{
              width: '50%',
              height: 400,
              border: '3px solid cyan',
              boxShadow: '0 0 20px cyan',
              backgroundColor: 'black',
            }}
          >
            <GameData
              isCoOp={false}
              controls={{
                player2: { left: 'ArrowLeft', right: 'ArrowRight', shoot: 'Slash', color: 'cyan' },
              }}
              favoriteShipIndex={[player2ShipIndex]}
            />
          </Box>
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