import { Button } from '@mui/material'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
}

const dashButtons = [
    {
        color: 'lime',
        text: 'START GAME'
    },
    {
        color: 'cyan',
        text: 'VIEW PROFILE'
    },
    {
        color: 'red',
        text: 'LOG OUT'
    }
]

const DashboardButtons: React.FC<Props> = () => {
    const navigate = useNavigate()

    const handleClick = (e) => {
        if (e.target.value === 'START GAME') {
            navigate('/game')
        } else if (e.target.value === 'VIEW PROFILE') {
            navigate('/profile')
        } else {
            localStorage.removeItem('token');
            navigate('/login');
        }
    }
    return (
        <>
            {dashButtons.map((button) => {
                return (
                    <Button
                        variant="outlined"
                        value={button.text}
                        sx={{
                            m: 2,
                            fontFamily: 'Press Start 2P',
                            color: button.color,
                            borderColor: button.color,
                            '&:hover': { backgroundColor: '#111' }
                        }}
                        onClick={(e) => handleClick(e)}
                    >
                        {button.text}
                    </Button>
                )
            })}
        </>
    )
}

export default DashboardButtons
