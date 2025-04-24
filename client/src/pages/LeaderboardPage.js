import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LeaderboardPage() {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/scores/leaderboard')
      .then(res => res.json())
      .then(setScores)
      .catch(console.error);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: 'Press Start 2P',
          color: '#00ffea',
          textShadow: '0 0 5px #00ffea'
        }}
      >
        HIGH SCORE LEADERBOARD
      </Typography>

      <Box sx={{ overflowX: 'auto', mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#ffcc00' }}>Rank</TableCell>
              <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#ffcc00' }}>Player</TableCell>
              <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#ffcc00' }}>Score</TableCell>
              <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#ffcc00' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#00ffea' }}>{idx + 1}</TableCell>
                <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#00ffea' }}>{row.email}</TableCell>
                <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#00ffea' }}>{row.score}</TableCell>
                <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#00ffea' }}>
                  {new Date(row.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Button
        variant="outlined"
        sx={{
          fontFamily: 'Press Start 2P',
          color: 'cyan',
          borderColor: 'cyan',
          '&:hover': { backgroundColor: '#111' }
        }}
        onClick={() => navigate('/dashboard')}
      >
        BACK
      </Button>
    </Container>
  );
}
