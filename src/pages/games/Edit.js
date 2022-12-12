// GameForm import
import GameForm from "../../components/GameForm";

// UI imports
import {Button, Hourglass, Window, WindowContent, WindowHeader} from "react95";

// React Router imports
import {Link, useParams} from "react-router-dom";

// HTTP request imports
import axios from "axios";

// State imports
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../AuthContext";

const Edit = () => {

	// Using id from URL params
	const { id } = useParams();

	// Initialising game state
	const [ game, setGame ] = useState(null);

	// Using token from AuthContext to authenticate request
	const { token } = useContext(AuthContext)

	// GET request to get game data using id from URL params
	useEffect(() => {
		axios.get(`https://fruity-steam.vercel.app/api/games/?by=_id&query=${id}`,
			{
				headers: {
					"Authorization": `Bearer ${token}`
				}
			})
			.then((response) => {
				console.log(response.data);
				setGame(response.data.data[0])
			})
			.catch((err) => {
				console.error(err);
				console.log(err.response.data.message);
			});
	}, [id]);

	// If game state is null, return window with loading animation
	if(!game) return (
		<div style={{display: "flex", justifyContent: 'center'}}>
			<Window style={{width: "250px"}}>
				<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
					<span style={{marginLeft: '0.2rem'}}>Game.exe</span>
					<Link to='/games/'>
						<Button style={{marginTop: '0.2rem'}}>X</Button>
					</Link>
				</WindowHeader>
				<WindowContent>
					<div style={{display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}>
						<p style={{fontSize: '1.5rem'}}>Loading...</p>
						<Hourglass size={48} style={{ margin: 20 }}/>
					</div>
				</WindowContent>
			</Window>
		</div>
	)

	// If game state is not null, return GameForm component with game data
	return (
		<>
			<GameForm game={game} setGame={setGame} key={game.id}/>
		</>
	);
};

export default Edit;
