import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import {AuthContext} from "../../AuthContext";
import GameCard from '../../components/GameCard';
import {json, Link, useParams} from "react-router-dom";
import {
	Button, Hourglass,
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

import authenticatedOptions from './json/authenticatedSelectOptions.json'
import unauthenticatedOptions from './json/unauthenticatedSelectOptions.json'

const Index = () => {
	// TODO: Figure out a way of allowing user to select specific page
	// TODO: Allow user to specify page limit
	// TODO: Allow user to remove NSFW filter (require age confirmation?)
	const {page} = useParams();
	const {token} = useContext(AuthContext)
	const [games, setGames] = useState(null);
	const [currentPage, setPage] = useState(1);
	const [filterActive, setFilterActive] = useState(false)
	const [searchBy, setSearchBy] = useState("Name")
	const [searchQuery, setSearchQuery] = useState({query: ""})
	const handleSearch = (e) => {
		let name = e.target.name;
		let value = e.target.value;

		setSearchQuery(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	let URL, authHeaders, builtQuery

	if(token){
		URL = 'https://fruity-steam.vercel.app/api/games'
		authHeaders = { headers: { "Authorization": `Bearer ${token}`}}
	} else {
		URL = 'https://fruity-steam.vercel.app/api/games/names'
		authHeaders = ''
	}

	if(filterActive){
		builtQuery = `&by=${searchBy}&query=${searchQuery.query}`
	} else {
		builtQuery = ''
	}

	let nsfwFilter = true

	useEffect(() => {
		axios.get(`${URL}?page=${currentPage}${builtQuery}`, authHeaders)
			.then((response) => {
				let data = response.data.data
				if(nsfwFilter){
/*
					if(data.filter(game => game.Notes).length > 0) {
						let count = 0
						let i
						console.group("Games with adult content:")
						for (i in data) {
							if (data[i].Notes) {
								count++
								console.log(count, "-", data[i].Name, ":", data[i].Notes)
							}
						}
						console.groupEnd()
						console.log("Filtered array", data.filter(game => !game.Notes))
					}
*/
					setGames(data.filter(game => !game.Notes))
					console.log(data.filter(game => !game.Notes))
				} else {
					setGames(data);
					console.log(data);
				}
				// setPage(Number(page))
			})
			.catch((err) => {
				console.error(err);
			});
	}, [URL, currentPage, builtQuery]);

	if (!games) return (
		<div style={{display: "flex", justifyContent: 'center'}}>
			<Window style={{width: "250px"}}>
				<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
					<span style={{marginLeft: '0.2rem'}}>Games.exe</span>
					<Link to='/'>
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

	const gamesList = games.map((game) => {
		return <GameCard game={game} key={game._id}/>;
	});

	// Creating list of options for select box
	let searchByOptions = []
	if(token){
		searchByOptions = authenticatedOptions
	} else {
		searchByOptions = unauthenticatedOptions
	}

	let unauthenticatedMessage
	if(!token){
		unauthenticatedMessage = (
			<>
				<div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
					<p>Note: You have to log in to see more than just game names!</p>
				</div>
			</>
		)
	}

	let authenticatedTableHeaders
	if(token){
		authenticatedTableHeaders = (
			<>
				<TableHeadCell>Link</TableHeadCell>
			</>
		)
	}

	return (
		<>
			<div style={{display: "flex", justifyContent: 'center'}}>
				<Window style={{width: "auto"}}>
					<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
						<span style={{marginLeft: '0.2rem'}}>Games.exe</span>
						<Link to='/'>
							<Button style={{marginTop: '0.2rem'}}>X</Button>
						</Link>
					</WindowHeader>
					<WindowContent>
						{ unauthenticatedMessage }
						<Button
							style={{marginBottom: '1rem'}}
							onClick={() => setFilterActive(!filterActive)}
							active={filterActive}
							fullWidth
						>
							Filter Results
						</Button>
						{/* Search div */}
						{filterActive &&
							<div style={{ display: 'flex', marginBottom: '1rem' }}>
								<TextInput
									placeholder='Type here...'
									fullWidth
									type="text"
									name="query"
									onChange={handleSearch}
									value={searchQuery.query}
								/>
								<Select
									defaultValue={"Name"}
									width={250}
									menuMaxHeight={200}
									options={searchByOptions}
									onChange={e => setSearchBy(e.value)}
								/>
							</div>
						}
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
									{ authenticatedTableHeaders }
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
