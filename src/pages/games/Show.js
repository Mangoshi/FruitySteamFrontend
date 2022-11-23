import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useEffect, useState} from 'react';
import GameCardDetailed from "../../components/GameCardDetailed";

const Show = () => {
	const {id} = useParams();
	const [game, setGame] = useState(null);

	useEffect(() => {
		axios.get(`https://fruity-steam.vercel.app/api/games/?by=_id&query=${id}`,
			{
				headers: {
					"Authorization": `Bearer ${process.env.REACT_APP_TOKEN}`
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

	if(!game) return 'Loading...';

	return (
		<>
			<h2>{game.Name}</h2>
			<GameCardDetailed game={game} />
		</>
	);
};

export default Show;
