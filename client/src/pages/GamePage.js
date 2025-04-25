// client/src/pages/GamePage.js

import React, { useRef, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function GamePage() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize to fill container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Simple starfield background
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      // Clear
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = 'white';
      stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ 
          fontFamily: 'Press Start 2P', 
          color: '#00ffea', 
          textShadow: '0 0 5px #00ffea' 
        }}
      >
        SPACE BOATS
      </Typography>

      <Box 
        sx={{ 
          position: 'relative', 
          width: '100%', 
          height: 400, 
          border: '3px solid cyan', 
          boxShadow: '0 0 20px cyan', 
          mb: 2 
        }}
      >
        <canvas 
          ref={canvasRef} 
          style={{ width: '100%', height: '100%', display: 'block' }} 
        />
        {/* Future: draw player ship, bullets, enemies here */}
      </Box>

      <Box>
        <Button
          variant="outlined"
          sx={{ 
            mx: 1, 
            fontFamily: 'Press Start 2P', 
            color: 'lime', 
            borderColor: 'lime' 
          }}
          onClick={() => alert('Game Start!')}
        >
          START
        </Button>
        <Button
          variant="outlined"
          sx={{ 
            mx: 1, 
            fontFamily: 'Press Start 2P', 
            color: 'cyan', 
            borderColor: 'cyan' 
          }}
          onClick={() => navigate('/dashboard')}
        >
          BACK
        </Button>
      </Box>
    </Container>
  );
}
