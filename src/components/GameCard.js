import { Link } from 'react-router-dom';
import { Button, TableDataCell, TableRow } from 'react95';
import { useGame } from "../useGame";
import {useContext} from "react";
import {AuthContext} from "../AuthContext";

const GameCard = (props) => {
    // importing token context to check if logged-in
    const {token} = useContext(AuthContext)
    // importing updateGameState function from useGame
    const { updateGameState } = useGame()

    // TODO: Game covers in table? (Server will need updating)
    let viewButton
    if(token){
        viewButton = (
            <>
                <TableDataCell style={{ textAlign: 'center' }}>
                    <Link to={`/game/${props.game._id}`}>
                        {/* onClick: update game state with game's name */}
                        <Button variant='flat' size='sm' onClick={() => updateGameState(props.game.Name)}>
                            <p style={{marginBottom: '0.2rem'}}>View <span style={{fontSize: '1.25rem'}}>&#128065;</span></p>
                        </Button>
                    </Link>
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
        </TableRow>
    );
};

export default GameCard;
