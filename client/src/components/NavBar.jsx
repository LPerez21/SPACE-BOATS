import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NavBar({ loggedIn, onLogout }) {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#000', boxShadow: '0 0 10px cyan' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Button
            component={RouterLink}
            to="/game"
            sx={{
              fontFamily: 'Press Start 2P',
              color: '#00ffea',
              mr: 2,
            }}
          >
            Game
          </Button>
          <Button
            component={RouterLink}
            to="/dashboard"
            sx={{
              fontFamily: 'Press Start 2P',
              color: '#00ffea',
              mr: 2,
            }}
          >
            Dashboard
          </Button>
          <Button
            component={RouterLink}
            to="/leaderboard"
            sx={{
              fontFamily: 'Press Start 2P',
              color: '#00ffea',
              mr: 2,
            }}
          >
            Leaderboard
          </Button>
        </Box>

        <Box>
          {loggedIn ? (
            <>
              <Button
                component={RouterLink}
                to="/profile"
                sx={{
                  fontFamily: 'Press Start 2P',
                  color: '#00ffea',
                  mr: 2,
                }}
              >
                Profile
              </Button>
              <Button
                onClick={onLogout}
                sx={{
                  fontFamily: 'Press Start 2P',
                  color: 'red',
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/register"
                sx={{
                  fontFamily: 'Press Start 2P',
                  color: '#00ffea',
                  mr: 2,
                }}
              >
                Register
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                sx={{
                  fontFamily: 'Press Start 2P',
                  color: '#00ffea',
                }}
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
