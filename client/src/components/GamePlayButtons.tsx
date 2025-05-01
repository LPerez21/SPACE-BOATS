import { Button } from '@mui/material';
import * as React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

const gameButtons = [
    {
        color: 'lime',
        key: 'singleplayer',
        text: 'Single Player'
    },
    {
        color: 'cyan',
        key: 'coop',
        text: 'Co Op'
    },
    {
        color: 'red',
        key: 'duel',
        text: 'Duel'
    }
]

const GamePlayButtons: React.FC  = () => {
    const navigate = useNavigate()
    const handleClick = (gameType) => {
        navigate({
          pathname: '/gameplay',
          search: createSearchParams({gameType: gameType}).toString()
        })
      }
    return (
        <>
            {
                gameButtons.map((button) => {
                    return (
                        <Button
                            key={button.key}
                            variant="outlined"
                            sx={{
                                mt: 2,
                                ml: button.key === 'singleplayer' ? 0 : 2,
                                fontFamily: 'Press Start 2P',
                                color: button.color,
                                borderColor: button.color,
                                '&:hover': { backgroundColor: '#111' },
                            }}
                            onClick={() => handleClick(button.key)}
                        >
                            {button.text}
                        </Button>
                    )
                })
            }
        </>
    )
}

export default GamePlayButtons

