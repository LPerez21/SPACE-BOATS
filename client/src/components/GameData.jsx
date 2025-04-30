import React, { useRef, useEffect } from 'react';
import enemy1Img from '/crab.png';
import enemy2Img from '/jellyfish.png';
import enemy3Img from '/octopus.png';
import enemy4Img from '/squid.png';
import enemy5Img from '/starfish.png';
import enemy6Img from '/shrimp.png';
import enemy7Img from '/eel.png';

export default function GameData({ isCoOp = false, controls = null }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let score = 0;
    let animationId;

    // Load ship image
    const shipImg = new Image();
    shipImg.src = '/ship.png';

    const ship2Img = new Image();
    ship2Img.src = '/ship2.png';

    let shipImageLoaded = false;
    shipImg.onload = () => {
      shipImageLoaded = true;
    };
    ship2Img.onload = () => {
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
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize game data
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.2,
    }));

    const ships = [
      {
        x: canvas.width / 4, // Player 1 starts on the left
        y: canvas.height - 30,
        w: 70,
        h: 70,
        speed: 7,
        color: 'lime',
        keys: { left: false, right: false, shoot: false },
        controls: controls?.player1 || { left: 'KeyA', right: 'KeyD', shoot: 'Space' }, // Default Player 1 controls
        bullets: [],
        health: 100,
      },
    ];

    if (isCoOp || controls?.player2) {
      ships.push({
        x: (canvas.width * 3) / 4, // Player 2 starts on the right
        y: canvas.height - 30,
        w: 70,
        h: 70,
        speed: 7,
        color: 'cyan',
        keys: { left: false, right: false, shoot: false },
        controls: controls?.player2 || { left: 'ArrowLeft', right: 'ArrowRight', shoot: 'Slash' }, // Default Player 2 controls
        bullets: [],
        health: 100,
      });
    }

    const enemies = [];

    // Input state
    const onKeyDown = (e) => {
      ships.forEach((ship) => {
        if (e.code === ship.controls.left) ship.keys.left = true;
        if (e.code === ship.controls.right) ship.keys.right = true;
        if (e.code === ship.controls.shoot) ship.keys.shoot = true;
      });
    };

    const onKeyUp = (e) => {
      ships.forEach((ship) => {
        if (e.code === ship.controls.left) ship.keys.left = false;
        if (e.code === ship.controls.right) ship.keys.right = false;
        if (e.code === ship.controls.shoot) ship.keys.shoot = false;
      });
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Game loop
    const loop = () => {
      frame++;

      // Clear background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw & move stars
      ctx.fillStyle = 'white';
      stars.forEach((star) => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
      });

      // Display player health
      ships.forEach((ship, index) => {
        console.log(`P${index + 1} Health: ${ship.health}`); // Debugging
        ctx.fillStyle = 'red';
        ctx.font = '16px Press Start 2P, Arial';
        ctx.fillText(`P${index + 1} Health: ${ship.health}`, 10, 50 + index * 20);
      });

      if (frame % 90 === 0) {
        const typeIndex = Math.floor(Math.random() * enemyImages.length);
        enemies.push({
          x: Math.random() * (canvas.width - 30) + 15,
          y: -20,
          size: 40, // TODO: Adjust to 70 if hitbox doesn't match png 
          speed: Math.random() * 1 + 1,
          img: enemyImages[typeIndex],
        });
      }

      // Update & draw enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.y += e.speed;

        // Draw enemy image
        if (e.img) {
          ctx.drawImage(e.img, e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
        }
        // Check for collisions with ships
        ships.forEach((ship) => {
          if (
            e.x > ship.x - ship.w / 2 &&
            e.x < ship.x + ship.w / 2 &&
            e.y > ship.y - ship.h / 2 &&
            e.y < ship.y + ship.h / 2
          ) {
            ship.health -= 20; // Reduce ship health
            enemies.splice(i, 1); // Remove enemy
          }
        });

        // Check if any player's health is zero
        if (ships.some((ship) => ship.health <= 0)) {
          cancelAnimationFrame(animationId);
          ctx.fillStyle = 'red';
          ctx.font = '24px Press Start 2P';
          ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
          return; // Stop the game loop
        }

        // Remove off-screen enemies
        if (e.y - e.size / 2 > canvas.height) enemies.splice(i, 1);
      }

      // Move & draw ships
      ships.forEach((ship, index) => {
        if (ship.keys.left) ship.x -= ship.speed;
        if (ship.keys.right) ship.x += ship.speed;
        ship.x = Math.max(ship.w / 2, Math.min(canvas.width - ship.w / 2, ship.x));

        // Draw ship image
        if (shipImageLoaded) {
          const shipImage = index === 0 ? shipImg : ship2Img; // Use ship.png for Player 1, ship2.png for Player 2
          ctx.drawImage(shipImage, ship.x - ship.w / 2, ship.y - ship.h / 2, ship.w, ship.h);
        } else {
          // Fallback triangle while image loads
          ctx.fillStyle = ship.color;
          ctx.beginPath();
          ctx.moveTo(ship.x, ship.y - ship.h / 2);
          ctx.lineTo(ship.x - ship.w / 2, ship.y + ship.h / 2);
          ctx.lineTo(ship.x + ship.w / 2, ship.y + ship.h / 2);
          ctx.closePath();
          ctx.fill();
        }

        // Shoot bullets
        if (ship.keys.shoot) {
          ship.bullets.push({
            x: ship.x,
            y: ship.y - ship.h / 2,
            r: 4,
            speed: 8,
          });
          ship.keys.shoot = false; // Prevent continuous shooting
        }

        // Update & draw bullets
        ctx.fillStyle = 'cyan';
        for (let bi = ship.bullets.length - 1; bi >= 0; bi--) {
          const b = ship.bullets[bi];
          b.y -= b.speed;

          if (b.y + b.r < 0) {
            ship.bullets.splice(bi, 1);
            continue;
          }

          ctx.fillRect(b.x - b.r / 2, b.y - b.r / 2, b.r, b.r);

          for (let ei = enemies.length - 1; ei >= 0; ei--) {
            const e = enemies[ei];
            if (
              b.x > e.x - e.size / 2 &&
              b.x < e.x + e.size / 2 &&
              b.y > e.y - e.size / 2 &&
              b.y < e.y + e.size / 2
            ) {
              enemies.splice(ei, 1);
              ship.bullets.splice(bi, 1);
              score += 10;
              break;
            }
          }
        }
      });

      ctx.fillStyle = 'yellow';
      ctx.font = '16px Press Start 2P';
      ctx.fillText(`Score: ${score}`, 10, 24);

      animationId = requestAnimationFrame(loop);
    };
    loop();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isCoOp, controls]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}