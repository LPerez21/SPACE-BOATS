import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function GamePage() {
  const navigate = useNavigate();

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
        {/* Single Player Button */}
        <Button
          variant="outlined"
          sx={{
            mt: 2,
            fontFamily: 'Press Start 2P',
            color: 'lime',
            borderColor: 'lime',
            '&:hover': { backgroundColor: '#111' },
          }}
          onClick={() => navigate('/singleplayer')}
        >
          Single Player
        </Button>

        {/* Co-Op Button */}
        <Button
          variant="outlined"
          sx={{
            mt: 2,
            ml: 2,
            fontFamily: 'Press Start 2P',
            color: 'cyan',
            borderColor: 'cyan',
            '&:hover': { backgroundColor: '#111' },
          }}
          onClick={() => navigate('/coop')}
        >
          Co-Op
        </Button>

        {/* Duel Button */}
        <Button
          variant="outlined"
          sx={{
            mt: 2,
            ml: 2,
            fontFamily: 'Press Start 2P',
            color: 'red',
            borderColor: 'red',
            '&:hover': { backgroundColor: '#111' },
          }}
          onClick={() => navigate('/duel')}
        >
          Duel
        </Button>
      </Box>
    </Container>
  );
}