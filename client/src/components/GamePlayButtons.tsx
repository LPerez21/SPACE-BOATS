import { Button } from '@mui/material';
import * as React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap CSS is loaded



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
    const [showRulesModal, setShowRulesModal] = React.useState(false); // New state for rules modal
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
                                '&:hover': {backgroundColor: 'cyan',
                                    boxShadow: '0 0 10px blue, 0 0 20px blue',
                                    color: 'black', },
                            }}
                            onClick={() => handleClick(button.key)}
                        >
                            {button.text}
                        </Button>
                    )
                })
            }
            
      {/* Rules Button */}
      <div style={{ marginTop: '2rem' }}>
        <Button
          variant="contained"
          color="info"
          sx={{
            fontFamily: 'Press Start 2P',
            color: 'black', // Default text color
            borderColor: 'cyan', // Cyan border
            backgroundColor: 'cyan', // Default background color
            boxShadow: '0 0 10px cyan, 0 0 10px cyan', // Cyan glow effect
            transition: '0.3s ease-in-out',
            '&:hover': {
              backgroundColor: 'black', // Turns black on hover
              color: 'white', // Text turns white on hover
              boxShadow: '0 0 10px black, 0 0 10px white', // Black glow effect on hover
              borderColor: 'white', // Border turns white on hover
            },
          }}
          onClick={() => setShowRulesModal(true)}
        >
          Rules
        </Button>
      </div>

      
      {/* Rules Modal */}
      <Modal show={showRulesModal} onHide={() => setShowRulesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Game Rules</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li>Select a mode to begin playing.</li>
            <li>Single Player: Play using the "A" and "D" keys to move right and left, and the "W" key to shoot.</li>
            <li>Co-Op and Duel: Play One uses the "A" and "D" keys to move right and left, and the space bar key to shoot. Player Two uses the right and left keys, and "/" to shoot</li>
            <li>Have fun and <em>try to </em>play fair!</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined" onClick={() => setShowRulesModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    )
}

export default GamePlayButtons

