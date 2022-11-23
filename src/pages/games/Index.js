import axios from 'axios';
import { useState, useEffect } from 'react';
import GameCard from '../../components/GameCard';

const Index = () => {
	const [ games, setGames ] = useState(null);

	useEffect(() => {
		axios.get('https://fruity-steam.vercel.app/api/games/names')
			.then((response) => {
				console.log(response.data);
				setGames(response.data.data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);


	if(!games) return 'Loading...';

	const gamesList = games.map((game) => {
		return <GameCard game={game} />;
	});

	return (
		<>
			<h2>Games</h2>
			{ gamesList }
		</>
	);
};

export default Index;
