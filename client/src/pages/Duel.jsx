import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import GameData from '../components/GameData';

export default function Duel() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: 'Press Start 2P', color: '#00ffea', textShadow: '0 0 5px #00ffea' }}
      >
        SPACE BOATS - DUEL MODE
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
            controls={{
              player1: { left: 'KeyA', right: 'KeyD', shoot: 'Space', color: 'lime' },
            }}
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
            controls={{
              player1: { left: 'ArrowLeft', right: 'ArrowRight', shoot: 'Slash', color: 'cyan' },
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}