// client/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '/logo.png';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      console.log('Registering with:', formData);

      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', res.status);

      const data = await res.json();
      console.log('Response body:', data);

      if (res.ok) {
        localStorage.setItem('userEmail', formData.email);

        alert('Registration successful! Please log in.');
        navigate('/login');
      } else {
        alert(`Registration failed: ${data.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Fetch error during registration:', err);
      alert('Network error: could not reach server.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
      <img src={Logo} alt="Logo" style={{ width: '500px', marginBottom: '20px' }} />
        
        {/* <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: 'Press Start 2P',
            color: '#ffcc00',
            textShadow: '0 0 5px #ffcc00'
          }}
        >
          CREATE ACCOUNT
        </Typography> */}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            InputProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffcc' } }}
            InputLabelProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffcc' } }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            InputProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffcc' } }}
            InputLabelProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffcc' } }}
          />
          <Button
            type="submit"
            variant="outlined"
            fullWidth
            sx={{
              mt: 4,
              fontFamily: 'Press Start 2P',
              color: 'black',
              fontWeight: 'bold',
              backgroundColor: 'cyan',
              boxShadow: '0 0 10px green, 0 0 20px green',
              transition: '0.3s ease-in-out',
              '&:hover': {
                backgroundColor: 'blue', // or any other color
                boxShadow: '0 0 10px blue, 0 0 20px blue',
              },
            }}
          >
            REGISTER
          </Button>
        </form>

        <Link
      component="button"
      onClick={() => navigate('/login')}
      underline="none"
      sx={{
        display: 'block',
        mt: 3,
        mx: 'auto',
        width: 'fit-content',
        fontFamily: 'Press Start 2P',
        color: '#ff0066',
        textShadow: '0 0 6px #ff0066',
        transition: 'transform 0.2s ease, color 0.2s ease',
        '&:hover': {
          color: '#ff99cc',
          transform: 'scale(1.05)',
          textShadow: '0 0 10px #ff99cc',
        }
      }}
    >
      ⬅ RETURN TO LOGIN
    </Link>

          </Box>
        </Container>
      );
    }
