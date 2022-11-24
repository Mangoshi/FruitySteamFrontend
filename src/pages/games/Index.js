import axios from 'axios';
import { useState, useEffect } from 'react';
import GameCard from '../../components/GameCard';
import { useParams } from "react-router-dom";
import { Button } from "react95";

const Index = () => {
	const [ games, setGames ] = useState(null);
	const [ currentPage, setPage ] = useState(1);
	const { page } = useParams();
	// TODO: Query builder! eg. if(bySelected){query+&by=by) [for each query type]
	// TODO: Update page based on currentPage, perhaps use more than back/forward?
	useEffect(() => {
		axios.get(`https://fruity-steam.vercel.app/api/games/names?page=${page}`)
			.then((response) => {
				console.log(response.data);
				setGames(response.data.data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [page]);

	if(!games) return 'Loading...';

	const gamesList = games.map((game) => {
		return <GameCard game={game} key={game._id} />;
	});

	return (
		<>
			<h2 style={{fontSize: '32px'}}>Games</h2>
			<h3 style={{fontSize: '24px'}}>Current page: {currentPage}</h3>
			<Button onClick={()=> setPage(currentPage - 1)}>Back</Button>
			<Button onClick={()=> setPage(currentPage + 1)}>Forward</Button>
			<br/>
			{ gamesList }
		</>
	);
};

export default Index;
