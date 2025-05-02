import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import GamePlayButtons from '../components/GamePlayButtons';
import Logo2 from '/logo2.png'

export default function GamePage() {

  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
            <img 
        src={Logo2}
        alt="Logo"
        style={{ width: '700px', mt: '20px', mb: '-50px' }}
     />
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: 'Press Start 2P', color: '#00ffea', textShadow: '0 0 5px #00ffea' }}
      >
        CHOOSE YOUR GAME MODE
      </Typography>

      <Box sx={{ mt: 4 }}>
        <GamePlayButtons />
      </Box>
    </Container>
  );
}