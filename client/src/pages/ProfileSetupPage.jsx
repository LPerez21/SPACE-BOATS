import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { playerAssets } from '../../images'; // Assuming playerAssets contains ship images

export default function ProfileSetupPage() {
  const [profile, setProfile] = useState({ username:'', bio:'', favorite_ship:'', email:'' });
  const [selectedShipIndex, setSelectedShipIndex] = useState(0); // State for "Choose Your Ship"
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  // const userEmail = localStorage.getItem('userEmail');

  // Check if user is logged in and keep values defined
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('http://localhost:8000/profile/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          email: data.email,
          username: data.username ?? '',
          bio: data.bio ?? '',
          favorite_ship: data.favorite_ship ?? '',
        });
      }
    };
    fetchProfile();
  }, [token]);
  
  // Handle input changes
  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle ship selection for "Choose Your Ship"
  const handleShipSelect = (index) => {
    setSelectedShipIndex(index); // Update the selected ship index
    localStorage.setItem('selectedShipIndex', index); // Save to localStorage
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // const userEmail = localStorage.getItem('userEmail');
    // const profileData = { ...profile, email: userEmail };

    const res = await fetch('http://localhost:8000/profile/me', {
      method: 'PUT',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });
    if (res.ok) {
      alert('Profile saved!');
      navigate('/dashboard');
    } else {
      alert('Error saving profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt:8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Press Start 2P', color: '#ffcc00', textShadow: '0 0 5px #ffcc00' }}>
          SET UP YOUR PROFILE
        </Typography>

        {/* Choose Your Ship Section */}
        <Typography
          variant="h6"
          sx={{ mt: 4, fontFamily: 'Press Start 2P', color: '#00ffcc' }}
        >
          Choose Your Ship
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            mt: 2,
          }}
        >
          {playerAssets.map((ship, index) => (
            <Box
              key={index}
              onClick={() => handleShipSelect(index)}
              sx={{
                border: selectedShipIndex === index ? '3px solid #00ffcc' : '3px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.2s, border-color 0.2s',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            >
              <img
                src={ship}
                alt={`Ship ${index + 1}`}
                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
              />
            </Box>
          ))}
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Username" name="username"
            value={profile.username} onChange={handleChange}
            margin="normal"
            InputProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffcc' } }}
            InputLabelProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffcc' } }}
          />
          <TextField
            fullWidth label="Bio" name="bio" multiline rows={3}
            value={profile.bio} onChange={handleChange}
            margin="normal"
            InputProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffcc' } }}
            InputLabelProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffcc' } }}
          />
          <TextField
            fullWidth label="Favorite Ship" name="favorite_ship"
            value={profile.favorite_ship} onChange={handleChange}
            margin="normal"
            InputProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffcc' } }}
            InputLabelProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffcc' } }}
          />
          <Button type="submit" variant="outlined" fullWidth sx={{ mt:3, fontFamily: 'Press Start 2P', color: 'cyan', borderColor: 'cyan' }}>
            SAVE PROFILE
          </Button>
        </form>

        <Button onClick={handleLogout} sx={{ mt: 4, fontFamily: 'Press Start 2P', color: 'red' }}>
          LOG OUT
        </Button>
      </Box>
    </Container>
  );
}