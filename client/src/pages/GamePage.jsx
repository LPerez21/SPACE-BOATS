import React, { useRef, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import enemy1Img from '/crab.png';
import enemy2Img from '/jellyfish.png';
import enemy3Img from '/octopus.png';
import enemy4Img from '/squid.png';
import enemy5Img from '/starfish.png';
import enemy6Img from '/shrimp.png';
import enemy7Img from '/eel.png';



export default function GamePage() {
  const canvasRef = useRef(null);
  const navigate  = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let frame    = 0;
    let score    = 0;
    let animationId;

    const shipImg = new Image();
    shipImg.src = '/ship.png'
    let shipImageLoaded = false;
    shipImg.onload = () => {
    shipImageLoaded = true;
};
    // Load enemy images
    const enemyImages = [enemy1Img, enemy2Img, enemy3Img, enemy4Img, enemy5Img, enemy6Img, enemy7Img].map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    let enemyImageLoaded = false;
    enemyImages.forEach(img => {
      img.onload = () => {
        enemyImageLoaded = true;
      };
    });



    // Resize canvas
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Starfield
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.2
    }));

    // Player ship
    const ship = {
      x: canvas.width / 2,
      y: canvas.height - 30,
      w: 70, // wider
      h: 70, // taller
      speed: 7
    };

    // Bullets & enemies
    const bullets = [];
    const enemies = [];

    // Input state
    const keys = { left: false, right: false };
    const onKeyDown = e => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA')  keys.left  = true;
      if (e.code === 'ArrowRight'|| e.code === 'KeyD')  keys.right = true;
      if (e.code === 'Space') {
        bullets.push({
          x: ship.x,
          y: ship.y - ship.h/2,
          r: 4,
          speed: 8
        });
      }
    };
    const onKeyUp = e => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA')  keys.left  = false;
      if (e.code === 'ArrowRight'|| e.code === 'KeyD')  keys.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);

    // Game loop
    const loop = () => {
      frame++;

      // 1) Clear background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2) Draw & move stars
      ctx.fillStyle = 'white';
      stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
      });

      // 3) Spawn enemies every 90 frames (~1.5s at 60fps)
      // if (frame % 90 === 0) {
      //   enemies.push({
      //     x: Math.random() * (canvas.width - 30) + 15,
      //     y: -20,
      //     size: 20,
      //     speed: Math.random() * 1 + 1
      //   });
      // }
      if (frame % 90 === 0) {
        const typeIndex = Math.floor(Math.random() * enemyImages.length);
        enemies.push({
          x: Math.random() * (canvas.width - 30) + 15,
          y: -20,
          size: 40, // or adjust per enemy
          speed: Math.random() * 1 + 1,
          img: enemyImages[typeIndex],
        });
      }
      

      // 4) Update & draw enemies
      // ctx.fillStyle = 'red';
      // for (let i = enemies.length - 1; i >= 0; i--) {
      //   const e = enemies[i];
      //   e.y += e.speed;
      //   // Draw as square
      //   ctx.fillRect(e.x - e.size/2, e.y - e.size/2, e.size, e.size);
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.y += e.speed;
        ctx.drawImage(
          e.img,
          e.x - e.size / 2,
          e.y - e.size / 2,
          e.size,
          e.size
        );
      
        if (e.y - e.size / 2 > canvas.height) enemies.splice(i, 1);
      }

      // 5) Move & draw ship
      if (keys.left)  ship.x -= ship.speed;
      if (keys.right) ship.x += ship.speed;
      ship.x = Math.max(ship.w/2, Math.min(canvas.width - ship.w/2, ship.x));

      // ctx.fillStyle = 'lime';
      // ctx.beginPath();
      // ctx.moveTo(ship.x, ship.y - ship.h/2);
      // ctx.lineTo(ship.x - ship.w/2, ship.y + ship.h/2);
      // ctx.lineTo(ship.x + ship.w/2, ship.y + ship.h/2);
      // ctx.closePath();
      // ctx.fill();

      if (shipImageLoaded) {
        ctx.drawImage(
          shipImg,
          ship.x - ship.w / 2,
          ship.y - ship.h / 2,
          ship.w,
          ship.h
        );
      } else {
        // Fallback triangle while image loads
        ctx.fillStyle = 'lime';
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y - ship.h / 2);
        ctx.lineTo(ship.x - ship.w / 2, ship.y + ship.h / 2);
        ctx.lineTo(ship.x + ship.w / 2, ship.y + ship.h / 2);
        ctx.closePath();
        ctx.fill();
      }
      
      

      // 6) Update & draw bullets, check collisions
      ctx.fillStyle = 'cyan';
      for (let bi = bullets.length - 1; bi >= 0; bi--) {
        const b = bullets[bi];
        b.y -= b.speed;
        // Remove off-screen
        if (b.y + b.r < 0) {
          bullets.splice(bi, 1);
          continue;
        }
        // Draw bullet
        ctx.fillRect(b.x - b.r/2, b.y - b.r/2, b.r, b.r);

        // Check collision with enemies
        for (let ei = enemies.length - 1; ei >= 0; ei--) {
          const e = enemies[ei];
          if (
            b.x > e.x - e.size/2 &&
            b.x < e.x + e.size/2 &&
            b.y > e.y - e.size/2 &&
            b.y < e.y + e.size/2
          ) {
            // Hit!
            bullets.splice(bi, 1);
            enemies.splice(ei, 1);
            score += 10;
            break;
          }
        }
      }

      // 7) Draw score
      ctx.fillStyle = 'yellow';
      ctx.font      = '16px Press Start 2P';
      ctx.fillText(`Score: ${score}`, 10, 24);

      animationId = requestAnimationFrame(loop);
    };
    loop();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize',  resize);
      window.removeEventListener('keydown',  onKeyDown);
      window.removeEventListener('keyup',    onKeyUp);
    };
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: 'Press Start 2P', color: '#00ffea', textShadow: '0 0 5px #00ffea' }}
      >
        SPACE BOATS
      </Typography>

      <Box
        sx={{
          width: '100%',
          height: 400,
          border: '3px solid cyan',
          boxShadow: '0 0 20px cyan',
          backgroundColor: 'black',
          mb: 2
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </Box>

      <Button
        variant="outlined"
        sx={{
          fontFamily: 'Press Start 2P',
          color: 'lime',
          borderColor: 'lime',
          '&:hover': { backgroundColor: '#111' }
        }}
        onClick={() => navigate('/dashboard')}
      >
        BACK TO DASHBOARD
      </Button>
    </Container>
  );
}

