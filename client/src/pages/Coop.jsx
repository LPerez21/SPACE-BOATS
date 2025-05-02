import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GameData from '../components/GameData';
import Logo2 from '/logo2.png'


export default function CoOp() {
  const navigate = useNavigate();

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
        CO-OP MODE
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
        {/* Mount the GameData component for co-op mode */}
        <GameData isCoOp={true} />
      </Box>

      <Button
        variant="outlined"
        sx={{
          fontFamily: 'Press Start 2P',
          color: 'lime',
          borderColor: 'lime',
          '&:hover': {backgroundColor: 'cyan',
            boxShadow: '0 0 10px blue, 0 0 20px blue',
            color: 'black', },
        }}
        onClick={() => navigate('/dashboard')}
      >
        BACK TO DASHBOARD
      </Button>
    </Container>
  );
}