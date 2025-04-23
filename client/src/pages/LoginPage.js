import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });

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
    } else {
      alert('Login failed');
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt:8 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Email" name="email"
            value={form.email} onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth label="Password" name="password" type="password"
            value={form.password} onChange={handleChange}
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>
            Log In
          </Button>
        </form>
      </Box>
    </Container>
  );
}
