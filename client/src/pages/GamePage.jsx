import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import GamePlayButtons from '../components/GamePlayButtons';

export default function GamePage() {

  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: 'Press Start 2P', color: '#00ffea', textShadow: '0 0 5px #00ffea' }}
      >
        SPACE BOATS
      </Typography>

      <Box sx={{ mt: 4 }}>
        <GamePlayButtons />
      </Box>
    </Container>
  );
}