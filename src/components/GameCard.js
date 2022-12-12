// UI imports
import { Button, TableDataCell, TableRow } from 'react95';

// React Router imports
import { Link } from 'react-router-dom';

// HTTP request imports
import axios from "axios";

// State imports
import { useGame } from "../useGame";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const GameCard = ({game, games, setGames}) => {
    // Importing token & role context to check if logged-in / authorized
    const { token, role } = useContext(AuthContext)
    // Importing updateGameState function from useGame
    const { updateGameState } = useGame()

    // Conditional rendering of view button based on user authentication
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

    // Function to confirm deletion of game from database
    const deleteGameConfirm = (game) => {
        let result = window.confirm(`Are you sure you want to delete ${game.Name}?`);
        if (result) {
            deleteGame(game._id);
        }
    }

    // Function to delete game from database
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

    // Conditional rendering of admin buttons based on user role
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

    // Rendering game card
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
