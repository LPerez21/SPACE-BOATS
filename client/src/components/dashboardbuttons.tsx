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
                        key={button.text}
                        variant="outlined"
                        value={button.text}
                        sx={{
                            m: 2,
                            fontFamily: 'Press Start 2P',
                            color: button.color,
                            borderColor: button.color,
                            '&:hover': {backgroundColor: 'cyan',
                                    boxShadow: '0 0 10px blue, 0 0 20px blue',
                                    color: 'black', }
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
