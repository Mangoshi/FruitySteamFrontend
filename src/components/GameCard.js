import { Link } from 'react-router-dom';
import { Button, TableDataCell, TableRow } from 'react95';
import { useGame } from "../useGame";

const GameCard = (props) => {
    // importing updateGameState function from useGame
    const { updateGameState } = useGame()
    return (
        <TableRow>
            <TableDataCell style={{width: '400px'}}>
                <div style={{whiteSpace: 'break-spaces'}}>{props.game.Name}</div>
            </TableDataCell>
            <TableDataCell style={{ textAlign: 'center' }}>
                <Link to={`/game/${props.game._id}`}>
                    {/* onClick: update game state with game's name */}
                    <Button variant='flat' size='sm' onClick={() => updateGameState(props.game.Name)}>
                        <p style={{marginBottom: '0.2rem'}}>View <span style={{fontSize: '1.25rem'}}>&#128065;</span></p>
                    </Button>
                </Link>
            </TableDataCell>
        </TableRow>
    );
};

export default GameCard;
