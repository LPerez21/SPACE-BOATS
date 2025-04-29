// client/src/pages/DashboardPage.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);

  // Fetch leaderboard on mount
  useEffect(() => {
    fetch('http://localhost:8000/scores/leaderboard')
      .then(res => res.json())
      .then(data => setScores(data))
      .catch(err => console.error('Failed loading leaderboard', err));
  }, []);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 6,
          p: 4,
          border: '4px solid cyan',
          boxShadow: '0 0 20px cyan',
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: '#000'
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: 'Press Start 2P',
            color: '#00ffcc',
            textShadow: '0 0 5px #00ffcc'
          }}
        >
          🚀 WELCOME, PILOT!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            fontFamily: 'Press Start 2P',
            color: '#ffcc00',
            textShadow: '0 0 3px #ffcc00'
          }}
        >
          The fate of the fleet rides with you. Are you ready to take command?
        </Typography>

        <Button
          variant="outlined"
          sx={{
            m: 2,
            fontFamily: 'Press Start 2P',
            color: 'lime',
            borderColor: 'lime',
            '&:hover': { backgroundColor: '#111' }
          }}
          onClick={() => navigate('/game')}
        >
          START GAME
        </Button>

        <Button
          variant="outlined"
          sx={{
            m: 2,
            fontFamily: 'Press Start 2P',
            color: 'cyan',
            borderColor: 'cyan',
            '&:hover': { backgroundColor: '#111' }
          }}
          onClick={() => navigate('/profile')}
        >
          VIEW PROFILE
        </Button>

        <Button
          variant="outlined"
          sx={{
            m: 2,
            fontFamily: 'Press Start 2P',
            color: 'red',
            borderColor: 'red',
            '&:hover': { backgroundColor: '#111' }
          }}
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          LOG OUT
        </Button>
      </Box>

      {/* Leaderboard Section */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontFamily: 'Press Start 2P',
            color: '#00ffea',
            textShadow: '0 0 5px #00ffea'
          }}
        >
          HIGH SCORE LEADERBOARD
        </Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Rank', 'Player', 'Score'].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontFamily: 'Press Start 2P',
                      color: '#ffcc00',
                      borderBottom: '2px solid #00ffea'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {scores.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#00ffea' }}>
                    {idx + 1}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#00ffea' }}>
                    {row.email}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#00ffea' }}>
                    {row.score}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Container>
  );
}
