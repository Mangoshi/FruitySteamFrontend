import axios from 'axios';
import {useState, useEffect} from 'react';
import GameCard from '../../components/GameCard';
import {useParams} from "react-router-dom";
import {
	Button,
	Select,
	Table,
	TableBody,
	TableHead,
	TableHeadCell,
	TableRow,
	TextInput,
	Window,
	WindowContent,
	WindowHeader
} from "react95";

const Index = () => {
	const [games, setGames] = useState(null);
	const [currentPage, setPage] = useState(1);
	const {page} = useParams();
	// TODO: Query builder! eg. if(bySelected){query+&by=by) [for each query type]
	// TODO: Update page based on currentPage, perhaps use more than back/forward?
	// TODO: Use "Notes" field to make NSFW filter [will need to update server too]
	//  - Server will need second field in find() to filter by Notes having content
	//  - Server's user schema will need DOB & showAdultContent bool
	//  - NSFW filter will toggle based on bool, somehow
	useEffect(() => {
		axios.get(`https://fruity-steam.vercel.app/api/games/names?page=${currentPage}`)
			.then((response) => {
				console.log(response.data);
				setGames(response.data.data);
				// setPage(Number(page))
			})
			.catch((err) => {
				console.error(err);
			});
	}, [currentPage]);

	if (!games) return 'Loading...';

	const gamesList = games.map((game) => {
		return <GameCard game={game} key={game._id}/>;
	});

	// Creating list of options for select box
	const searchByOptions = []
	for (const [key] of Object.entries(games[0])) {
		let optionObject = {
			value: key,
			label: key
		}
		searchByOptions.push(optionObject)
	}

	return (
		<>
			<div style={{display: "flex", justifyContent: 'center'}}>
				<Window style={{width: "auto"}}>
					<WindowHeader>Games.exe</WindowHeader>
					<WindowContent>
						{/* Search div */}
						<div style={{ display: 'flex', marginBottom: '1rem' }}>
							<TextInput
								placeholder='Type here...'
								fullWidth
							/>
							<Select
								defaultValue={"Name"}
								width={250}
								options={searchByOptions}
								onChange={e => console.log('change', e)}
								onOpen={e => console.log('open', e)}
								onClose={e => console.log('close', e)}
								onBlur={e => console.log('blur', e)}
								onFocus={e => console.log('focus', e)}
							/>
							<Button onClick={e => console.log('click', e)} style={{ marginLeft: 4 }}>
								Search
							</Button>
						</div>
						{/* Pagination div */}
						<div style={{display: 'flex', justifyContent: 'space-between'}}>
							{/* Previous Block*/}
							<div>
								{/* If page is greater than 1, activate back button */}
								{currentPage > 1 ? (
									<Button size='sm' onClick={() => setPage(currentPage - 1)}> {"<<"} </Button>
									) : (
									<Button size='sm' disabled> {"<<"} </Button>
									)
								}
							</div>
							{/* Numeric Block*/}
							<div>
								{/* 2 before */}
								{currentPage === 2 &&
									<Button size='sm' onClick={() => setPage(currentPage - 1)}>{currentPage - 1}</Button>
								}
								{currentPage > 2 &&
									<>
										<Button size='sm' onClick={() => setPage(currentPage - 2)}>{currentPage - 2}</Button>
										<Button size='sm' onClick={() => setPage(currentPage - 1)}>{currentPage - 1}</Button>
									</>
								}
								{/* Current page */}
								<Button size='sm' active>{currentPage}</Button>

								{/* TODO: Ternary to hide these as you approach page 633 */}
								{/* 2 after */}
								<Button size='sm' onClick={() => setPage(currentPage + 1)}>{currentPage + 1}</Button>
								<Button size='sm' onClick={() => setPage(currentPage + 2)}>{currentPage + 2}</Button>
							</div>
							{/* Next Block */}
							<div>
								{/* If page is less than 633, activate forward button */}
								{currentPage < 633 ? (
									<Button size='sm' onClick={() => setPage(currentPage + 1)}> {">>"} </Button>
									) : (
									<Button size='sm' disabled> {">>"} </Button>
									)
								}
							</div>
						</div>
						<Table>
							<TableHead>
								<TableRow>
									<TableHeadCell>Name</TableHeadCell>
									<TableHeadCell>Link</TableHeadCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{gamesList}
							</TableBody>
						</Table>
					</WindowContent>
				</Window>
			</div>
		</>
	);
};

export default Index;
