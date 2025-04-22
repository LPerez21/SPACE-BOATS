import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

export default function ProfileSetupPage() {
  const [profile, setProfile] = useState({ username:'', bio:'', favorite_ship:'' });

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8000/profile', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });
    if (res.ok) alert('Profile saved!');
    else alert('Error saving profile');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt:8 }}>
        <Typography variant="h4" gutterBottom>Set Up Your Profile</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Username" name="username"
            value={profile.username} onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth label="Bio" name="bio" multiline rows={3}
            value={profile.bio} onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth label="Favorite Ship" name="favorite_ship"
            value={profile.favorite_ship} onChange={handleChange}
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>
            Save Profile
          </Button>
        </form>
      </Box>
    </Container>
  );
}
