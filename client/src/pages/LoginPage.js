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
    const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(form)
    });
    const data = await res.json();
    console.log("Login response:", data);
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      onLogin();
      navigate('/profile');  // Navigate after login
    } else {
      alert('Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert("Logged out!");
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Press Start 2P', color: 'limegreen', textShadow: '0 0 5px limegreen' }}>
          SPACE BOATS LOGIN
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
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
            value={form.password}
            onChange={handleChange}
            margin="normal"
            InputProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffcc' } }}
            InputLabelProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffcc' } }}
          />
          <Button type="submit" variant="outlined" fullWidth sx={{ mt: 3, fontFamily: 'Press Start 2P', color: 'cyan', borderColor: 'cyan' }}>
            LOG IN
          </Button>
        </form>

        <Link href="/register" underline="hover" sx={{ display: 'block', mt: 3, fontFamily: 'Press Start 2P', color: '#ff0066' }}>
          NEW PILOT? REGISTER HERE
        </Link>

        <Button onClick={handleLogout} sx={{ mt: 4, fontFamily: 'Press Start 2P', color: 'red' }}>
          LOG OUT
        </Button>
      </Box>
    </Container>
  );
}
