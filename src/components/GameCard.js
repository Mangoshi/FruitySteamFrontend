import { Link } from 'react-router-dom';
import { Button, TableDataCell, TableRow } from 'react95';
import { useGame } from "../useGame";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const GameCard = (props) => {
    // importing token context to check if logged-in
    const { token, role } = useContext(AuthContext)
    // importing updateGameState function from useGame
    const { updateGameState } = useGame()

    // TODO: Game covers in table? (Server will need updating)
    let viewButton
    if(token){
        viewButton = (
            <>
                <TableDataCell style={{ textAlign: 'center' }}>
                    <Link to={`/games/id/${props.game._id}`}>
                        {/* onClick: update game state with game's name */}
                        <Button variant='flat' size='sm' onClick={() => updateGameState(props.game.Name)}>
                            <p
                                style={{marginBottom: '0.2rem', fontSize: '1.25rem',}}
                            >
                                &#128065;
                            </p>
                        </Button>
                    </Link>
                </TableDataCell>
            </>
        )
    }

    let adminButtons
    if(role==='admin'){
        adminButtons = (
            <>
                <TableDataCell style={{ textAlign: 'center' }}>
                    <Link to={`/games/edit/${props.game._id}`}>
                        {/* onClick: update game state with game's name */}
                        <Button variant='flat' size='sm' onClick={() => updateGameState(props.game.Name)}>
                            <p style={{marginBottom: '0.2rem', fontSize: '1.25rem'}}>&#9998;</p>
                        </Button>
                    </Link>
                </TableDataCell>
                <TableDataCell style={{ textAlign: 'center' }}>
                    {/* TODO: onClick: confirm delete game using game's id */}
                    <Button variant='flat' size='sm' onClick={() => updateGameState(props.game.Name)}>
                        <p style={{marginBottom: '0.2rem', fontSize: '1.25rem'}}>&#10008;</p>
                    </Button>
                </TableDataCell>
            </>
            )
    }

    return (
        <TableRow>
            <TableDataCell style={{width: '400px'}}>
                <div style={{whiteSpace: 'break-spaces'}}>{props.game.Name}</div>
            </TableDataCell>
            {viewButton}
            {adminButtons}
        </TableRow>
    );
};

export default GameCard;
