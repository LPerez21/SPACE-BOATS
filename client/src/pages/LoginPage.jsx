import React, { useState } from 'react';
import { Container, TextField, Button, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '/logo.png';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      console.log('Logging in with:', form);
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: form.email,
          password: form.password
        })
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        const errText = await res.text();
        console.error('Login failed:', errText);
        alert(errText || 'Login failed with status ' + res.status);
        return;
      }

      // at this point we know the server returned JSON
      const data = await res.json();
      console.log('Response body:', data);

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        onLogin();
        navigate('/dashboard');
      } else {
        alert(data.detail || 'Login succeeded but no token returned');
      }
    } catch (err) {
      console.error('Network or parse error:', err);
      alert('Network error: could not reach server.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <img
          src={Logo}
          alt="Logo"
          style={{ width: '500px', marginBottom: '20px' }}
        />

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
              mt: 4,
              fontFamily: 'Press Start 2P',
              color: 'black',
              fontWeight: 'bold',
              backgroundColor: 'cyan',
              boxShadow: '0 0 10px green, 0 0 20px green',
              transition: '0.3s ease-in-out',
              '&:hover': {
                backgroundColor: 'blue',
                boxShadow: '0 0 10px blue, 0 0 20px blue',
              },
            }}
          >
            LOGIN
          </Button>
        </form>

        <Link
          href="/register"
          underline="hover"
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
            },
          }}
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
