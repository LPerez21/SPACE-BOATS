// client/src/pages/LoginPage.js

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '/logo.png'

export default function LoginPage() {

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <img src={Logo} alt="Logo" style={{ width: '500px', marginBottom: '20px' }} />
        <p style={{ marginBottom: '4px', marginBottom: '-30px' }} className="cta-label">Login</p>
        <Button
          type="submit"
          onClick={handleLoginClick}
          variant="outlined"
          fullWidth
          sx={{
            mt: 4,
            py: 2, // more vertical padding (bigger height)
            borderRadius: '20px', // rounded edges
            fontSize: '1rem', // slightly larger text
            fontFamily: 'Press Start 2P',
            fontWeight: 'bold',
            color: 'black',
            backgroundColor: 'cyan',
            border: '2px solid black', // outlined style
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
        <p style={{ marginBottom: '4px', marginBottom: '-30px', marginTop: '20px' }} className="cta-label">Sign Up</p>
        <Button
          type="submit"
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
