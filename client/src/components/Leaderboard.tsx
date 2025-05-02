import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import * as React from 'react'

interface Props {
    scores: any;
}

const Leaderboard: React.FC<Props> = ({ scores }: Props) => {
    return (
        <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontFamily: 'Press Start 2P',
                    color: '#00ffea',
                    textShadow: '0 0 5px #00ffea'
                }}
            >
                Leaderboard
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {['Rank', 'Pilot', 'Score', 'Date'].map((header) => (
                                <TableCell
                                    key={header}
                                    sx={{
                                        fontFamily: 'Press Start 2P',
                                        color: '#ffcc00',
                                        borderBottom: '2px solid #00ffea'
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {scores.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#00ffea' }}>
                                    {idx + 1}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#00ffea' }}>
                                    {row.email}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#00ffea' }}>
                                    {row.score}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'Press Start 2P', color: '#00ffea' }}>
                                    {new Date(row.timestamp).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    )
}

export default Leaderboard

