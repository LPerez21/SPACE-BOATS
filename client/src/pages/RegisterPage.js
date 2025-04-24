// client/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

      const res = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', res.status);

      const data = await res.json();
      console.log('Response body:', data);

      if (res.ok) {
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
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: 'Press Start 2P',
            color: '#ffcc00',
            textShadow: '0 0 5px #ffcc00'
          }}
        >
          CREATE ACCOUNT
        </Typography>

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
              mt: 3,
              fontFamily: 'Press Start 2P',
              color: 'cyan',
              borderColor: 'cyan',
              '&:hover': { backgroundColor: '#111' }
            }}
          >
            REGISTER
          </Button>
        </form>

        <Link
          component="button"
          onClick={() => navigate('/login')}
          underline="hover"
          sx={{
            display: 'block',
            mt: 3,
            fontFamily: 'Press Start 2P',
            color: '#ff0066'
          }}
        >
          RETURN TO LOGIN
        </Link>
      </Box>
    </Container>
  );
}
