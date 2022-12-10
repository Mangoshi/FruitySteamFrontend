import { Link } from 'react-router-dom';
import { Button, TableDataCell, TableRow } from 'react95';
import { useGame } from "../useGame";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const GameCard = ({game, games, setGames}) => {
    // importing token context to check if logged-in
    const { token, role } = useContext(AuthContext)
    // importing updateGameState function from useGame
    const { updateGameState } = useGame()

    let viewButton
    if(token){
        viewButton = (
            <>
                <TableDataCell style={{ textAlign: 'center' }}>
                    <Link to={`/games/id/${game._id}`}>
                        {/* onClick: update game state with game's name */}
                        <Button variant='flat' size='sm' onClick={() => updateGameState(game.Name)}>
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

    const deleteGameConfirm = (game) => {
        let result = window.confirm(`Are you sure you want to delete ${game.Name}?`);
        if (result) {
            deleteGame(game._id);
        }
    }

    const deleteGame = (id) => {
        axios.delete(`https://fruity-steam.vercel.app/api/games/id/${id}`, {
            headers: { "Authorization": `Bearer ${token}`}
        })
            .then((response) => {
                console.log(response);
                setGames(games.filter(game => game._id !== id));
            })
            .catch((err) => {
                console.error(err);
            });
    }

    let adminButtons
    if(role==='admin'){
        adminButtons = (
            <>
                <TableDataCell style={{ textAlign: 'center' }}>
                    <Link to={`/games/edit/${game._id}`}>
                        {/* onClick: update game state with game's name */}
                        <Button variant='flat' size='sm' onClick={() => updateGameState(game.Name)}>
                            <p style={{marginBottom: '0.2rem', fontSize: '1.25rem'}}>&#9998;</p>
                        </Button>
                    </Link>
                </TableDataCell>
                <TableDataCell style={{ textAlign: 'center' }}>
                    <Button variant='flat' size='sm' onClick={() => deleteGameConfirm(game)}>
                        <p style={{marginBottom: '0.2rem', fontSize: '1.25rem'}}>&#10008;</p>
                    </Button>
                </TableDataCell>
            </>
            )
    }

    return (
        <TableRow>
            <TableDataCell style={{width: '400px'}}>
                <div style={{whiteSpace: 'break-spaces'}}>{game.Name}</div>
            </TableDataCell>
            {viewButton}
            {adminButtons}
        </TableRow>
    );
};

export default GameCard;
