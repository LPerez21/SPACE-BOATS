import React, { useRef, useEffect } from 'react';
import { enemyAssets, playerAssets } from '../../images';

export default function GameData({ isCoOp = false, controls = null, favoriteShipIndex = [0, 1] }) {
  const canvasRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "/api"; // Access the environment variable

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let score = 0;
    let animationId;

    const saveScore = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the user's token
        const response = await fetch(`${BACKEND_URL}/scores`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token for authentication
          },
          body: JSON.stringify({ score }), // Send the score
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to save score:', errorData.detail);
          alert('Failed to save score: ' + (errorData.detail || 'Unknown error'));
        } else {
          console.log('Score saved successfully!');
          alert('Score saved successfully!');
        }
      } catch (err) {
        console.error('Error saving score:', err);
        alert('Network error: Could not save score.');
      }
    };

    // Load player ship images dynamically
    const playerImages = playerAssets.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    let playerImagesLoadedCount = 0;
    playerImages.forEach((img) => {
      img.onload = () => {
        playerImagesLoadedCount++;
      };
    });

    // Helper function to check if all player images are loaded
    const arePlayerImagesLoaded = () => playerImagesLoadedCount === playerImages.length;

    // Load enemy images
    const enemyImages = enemyAssets.map(src => {
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

    const ships = [];

    // Handle Player 1
    if (isCoOp) {
      // Handle Co-Op Mode
      if (controls?.player1) {
        ships.push({
          x: canvas.width / 4, // Player 1 starts on the left
          y: canvas.height - 30,
          w: 70,
          h: 70,
          speed: 7,
          color: controls.player1.color || 'lime',
          keys: { left: false, right: false, shoot: false },
          controls: controls.player1,
          bullets: [],
          health: 100,
          imgIndex: favoriteShipIndex[0], // Use the first index for Player 1
        });
      }
    
      if (controls?.player2) {
        ships.push({
          x: (canvas.width * 3) / 4, // Player 2 starts on the right
          y: canvas.height - 30,
          w: 70,
          h: 70,
          speed: 7,
          color: controls.player2.color || 'cyan',
          keys: { left: false, right: false, shoot: false },
          controls: controls.player2,
          bullets: [],
          health: 100,
          imgIndex: favoriteShipIndex[1], // Use the second index for Player 2
        });
      }
    } else {
      // Handle Single Player Mode
      if (controls?.player1) {
        ships.push({
          x: canvas.width / 2,
          y: canvas.height - 30,
          w: 70,
          h: 70,
          speed: 7,
          color: controls.player1.color || 'lime',
          keys: { left: false, right: false, shoot: false },
          controls: controls.player1,
          bullets: [],
          health: 100,
          imgIndex: favoriteShipIndex[0],
        });
      } else if (controls?.player2) {
        ships.push({
          x: (canvas.width * 3) / 4,
          y: canvas.height - 30,
          w: 70,
          h: 70,
          speed: 7,
          color: controls.player2.color || 'cyan',
          keys: { left: false, right: false, shoot: false },
          controls: controls.player2,
          bullets: [],
          health: 100,
          imgIndex: favoriteShipIndex[0], // Use the first index for Player 2
        });
      }
    }

    const enemies = [];
    const medipacks = [];
    const miniBosses = [];
    const miniBossBullets = [];

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
        // console.log(`P${index + 1} Health: ${ship.health}`); // Debugging
        ctx.fillStyle = 'red';
        ctx.font = '16px Press Start 2P, Arial';
        ctx.fillText(`P${index + 1} Health: ${ship.health}`, 10, 50 + index * 20);
      });

      // Defines enemy spawn rate
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

      // Defines medipack spawn rate
      if (frame % 600 === 0) {
        medipacks.push({
          x: Math.random() * (canvas.width - 30) + 15,
          y: -20,
          size: 15,
          speed: 2,
        });
      }

      // Defines mini-boss spawn rate
      if (frame % 900 === 0) {
        miniBosses.push({
          x: Math.random() * (canvas.width - 30) + 15,
          y: (-1 * (canvas.width / 10)) -20, // 20 px above canvas + size of the mini-boss
          targetY: Math.random() * (canvas.height / 3 - canvas.height / 5) + canvas.height / 5, // Random Y position between 1/5 and 1/3 of the canvas height
          size: canvas.width / 10,
          speed: 3,
          health: 200,
          direction: Math.random() < 0.5 ? -1 : 1, // Multiply by speed; Assigns 1 (right) or -1 (left)
          fireCooldown: 300, // Fire every 300 frames
        });
      }

      // Draw mini-bosses
      for (let i = miniBosses.length - 1; i >= 0; i--) {
        const mb = miniBosses[i];

        // Move mini-boss to position
        if (mb.y < mb.targetY) {
          mb.y += (mb.speed / 4);
        } else {
          mb.y = mb.targetY; // Set to target Y position

          // Move horizontally
          mb.x += mb.speed * mb.direction;

          // Bounce off canvas and reverse direction
          if (mb.x < mb.size / 2 || mb.x > canvas.width - mb.size / 2) {
            mb.direction *= -1; // Reverse direction by flipping positive to negative & negative to positive
          }
        }

        // Handle firing bullets
        if (mb.fireCooldown <= 0) {
          const leftBulletX = mb.x - mb.size / 4; // Left bullet position
          const rightBulletX = mb.x + mb.size / 4; // Right bullet position

          miniBossBullets.push({
            x: leftBulletX,
            y: mb.y + mb.size / 2, // Start below the mini-boss
            size: 8, // Bullet size
            speed: 2.5, // Bullet speed
          },
          {
            x: rightBulletX,
            y: mb.y + mb.size / 2, // Start below the mini-boss
            size: 8, // Bullet size
            speed: 2.5, // Bullet speed
          }
        );
          mb.fireCooldown = 50; // Reset cooldown
        } else {
          mb.fireCooldown--; // Decrement cooldown
        }

        // Draw mini-boss image
        ctx.fillStyle = 'red';
        ctx.fillRect(mb.x - mb.size / 2, mb.y - mb.size / 2, mb.size, mb.size / 2);

        // Update and draw mini-boss bullets
        for (let i = miniBossBullets.length - 1; i >= 0; i--) {
          const bullet = miniBossBullets[i];

        // Move bullet downward
        bullet.y += bullet.speed;

        // Remove bullet if it goes off-screen
        if (bullet.y > canvas.height) {
          miniBossBullets.splice(i, 1);
          continue;
        }

        // Draw bullet
        ctx.fillStyle = 'orange';
        ctx.fillRect(bullet.x - bullet.size / 2, bullet.y - bullet.size / 2, bullet.size, bullet.size);

        // Check for collisions with player ships
        ships.forEach((ship) => {
          if (
            bullet.x > ship.x - ship.w / 2 &&
            bullet.x < ship.x + ship.w / 2 &&
            bullet.y > ship.y - ship.h / 2 &&
            bullet.y < ship.y + ship.h / 2
          ) {
            ship.health -= 20; // Reduce player health
            miniBossBullets.splice(i, 1); // Remove bullet
              if (ship.health <= 0) {
                console.log(`Player ${ships.indexOf(ship) + 1} has been defeated!`);
              }     
            }
        });
      }

        // Check for player bullet collision with mini-boss
        ships.forEach((ship) => {
          ship.bullets.forEach((b, bi) => {
            if (
              b.x > mb.x - mb.size / 2 &&
              b.x < mb.x + mb.size / 2 &&
              b.y > mb.y - mb.size / 2 &&
              b.y < mb.y + mb.size / 2
            ) {
              mb.health -= 20; // Reduce mini-boss health
              ship.bullets.splice(bi, 1); // Remove bullet
              if (mb.health <= 0) {
                miniBosses.splice(i, 1); // Remove mini-boss
                score += 100; // Increase score
              }
            }
          });
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

        // Update & draw medipacks
        for (let j = medipacks.length - 1; j >= 0; j--) {
          const m = medipacks[j];
          m.y += m.speed;

          // Draw medipack
          ctx.fillStyle = 'green';
          ctx.fillRect(m.x - m.size / 2, m.y - m.size / 2, m.size, m.size);

          // Check for collisions with ships
          ships.forEach((ship) => {
            if (
              m.x > ship.x - ship.w / 2 &&
              m.x < ship.x + ship.w / 2 &&
              m.y > ship.y - ship.h / 2 &&
              m.y < ship.y + ship.h / 2
            ) {
              ship.health += 30; // Increase ship health
              if (ship.health > 100) ship.health = 100; // Cap health at 100
              medipacks.splice(j, 1); // Remove medipack
            }
          });
        }

        // Check if any player's health is zero
        if (ships.some((ship) => ship.health <= 0)) {
          cancelAnimationFrame(animationId);
          saveScore();
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

        // Draw ship image dynamically
        if (arePlayerImagesLoaded()) {
          const shipImage = playerImages[ship.imgIndex]; // Use the appropriate image for the ship
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
  }, [isCoOp, controls, favoriteShipIndex]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}