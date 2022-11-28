import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useEffect, useState} from 'react';
import GameCardDetailed from "../../components/GameCardDetailed";
import {Button, Hourglass, Window, WindowContent, WindowHeader} from "react95";

const Show = () => {
	const { id } = useParams();
	const [ game, setGame ] = useState(null);

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

	if(!game) return (
		<div style={{display: "flex", justifyContent: 'center'}}>
			<Window style={{width: "250px"}}>
				<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
					<span style={{marginLeft: '0.2rem'}}>Game.exe</span>
					<Button style={{marginTop: '0.2rem'}}>X</Button>
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

	return (
		<>
			<GameCardDetailed game={game} />
		</>
	);
};

export default Show;
