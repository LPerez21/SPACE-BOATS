import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);

    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Registration successful! Please log in.");
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      alert("Server error during registration.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Press Start 2P', color: '#ffcc00', textShadow: '0 0 5px #ffcc00' }}>
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
          <Button type="submit" variant="outlined" fullWidth sx={{ mt: 3, fontFamily: 'Press Start 2P', color: 'cyan', borderColor: 'cyan' }}>
            REGISTER
          </Button>
        </form>

        <Link href="/login" underline="hover" sx={{ display: 'block', mt: 3, fontFamily: 'Press Start 2P', color: '#ff0066' }}>
          RETURN TO LOGIN
        </Link>
      </Box>
    </Container>
  );
};

export default RegisterPage;
