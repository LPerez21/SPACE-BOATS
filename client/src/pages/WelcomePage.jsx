// client/src/pages/LoginPage.js

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '/logo.png';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  // (You probably need to call useState here for `form`, e.g.
  // const [form, setForm] = useState({ username: '', password: '' });
  // but I left that out since it wasn't in your snippet.)

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Box
          component="img"
          src={Logo}
          alt="Logo"
          sx={{ width: '500px', mb: 2 }}
        />

        <Typography
          variant="h6"
          className="cta-label"
          sx={{ mb: -4 }}
        >
          Login
        </Typography>

        <Button
          onClick={handleLoginClick}
          variant="outlined"
          fullWidth
          sx={{
            mt: 4,
            py: 2,
            borderRadius: '20px',
            fontSize: '1rem',
            fontFamily: 'Press Start 2P',
            fontWeight: 'bold',
            color: 'black',
            backgroundColor: 'cyan',
            border: '2px solid black',
            boxShadow: '0 0 10px green, 0 0 20px green',
            transition: '0.3s ease-in-out',
            '&:hover': {
              backgroundColor: 'blue',
              boxShadow: '0 0 10px blue, 0 0 20px blue',
              color: 'white',
            },
          }}
        >
          Enter the Cosmos
        </Button>

        <Typography
          variant="h6"
          className="cta-label"
          sx={{ mt: 5, mb: -4 }}
        >
          Sign Up
        </Typography>

        <Button
          onClick={handleRegisterClick}
          variant="outlined"
          fullWidth
          sx={{
            mt: 4,
            py: 2,
            borderRadius: '20px',
            fontSize: '1rem',
            fontFamily: 'Press Start 2P',
            fontWeight: 'bold',
            color: 'black',
            backgroundColor: 'cyan',
            border: '2px solid black',
            boxShadow: '0 0 10px green, 0 0 20px green',
            transition: '0.3s ease-in-out',
            '&:hover': {
              backgroundColor: 'blue',
              boxShadow: '0 0 10px blue, 0 0 20px blue',
              color: 'white',
            },
          }}
        >
          Register Your Starship
        </Button>
      </Box>
    </Container>
  );
}
