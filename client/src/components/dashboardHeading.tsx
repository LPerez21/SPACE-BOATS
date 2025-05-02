import * as React from 'react'
import DashboardButtons from './dashboardButtons'
import { Box, Typography } from '@mui/material'

const DashboardHeading: React.FC = () => {
    return (
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
                Ready to command your Space Boat?
            </Typography>
            <DashboardButtons />
        </Box>
    )
}

export default DashboardHeading