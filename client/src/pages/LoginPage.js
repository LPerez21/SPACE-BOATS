// client/src/pages/LoginPage.js

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Prepare x-www-form-urlencoded body
    const formBody = new URLSearchParams();
    formBody.append('username', form.email);
    formBody.append('password', form.password);

    const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody
    });

    const data = await res.json();
    if (res.ok && data.access_token) {
      // Save token
      localStorage.setItem('token', data.access_token);
      onLogin();                   // update App.js state
      navigate('/dashboard');      // go to your arcade Dashboard
    } else {
      alert(data.detail || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Press Start 2P', color: '#00ffea' }}>
          SPACE BOATS LOGIN
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            InputProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffea' } }}
            InputLabelProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffea' } }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            InputProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffea' } }}
            InputLabelProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffea' } }}
          />
          <Button
            type="submit"
            variant="outlined"
            fullWidth
            sx={{
              mt: 3,
              fontFamily: 'Press Start 2P',
              color: '#00ffea',
              borderColor: '#00ffea',
              '&:hover': { backgroundColor: '#111' }
            }}
          >
            LOG IN
          </Button>
        </form>

        <Link
          href="/register"
          underline="hover"
          sx={{ display: 'block', mt: 2, fontFamily: 'Press Start 2P', color: '#ff0066' }}
        >
          NEW PILOT? REGISTER HERE
        </Link>

        {localStorage.getItem('token') && (
          <Button
            onClick={handleLogout}
            sx={{ mt: 4, fontFamily: 'Press Start 2P', color: 'red' }}
          >
            LOG OUT
          </Button>
        )}
      </Box>
    </Container>
  );
}
