import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import {AuthContext} from "../../AuthContext";
import GameCard from '../../components/GameCard';
import {Link, useParams} from "react-router-dom";
import {
	Button,
	GroupBox,
	Hourglass,
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

import authenticatedOptions from './json/authenticatedOptions.json'
import unauthenticatedOptions from './json/unauthenticatedOptions.json'

const Index = () => {
	// TODO: Figure out a way of allowing user to select specific page
	// TODO: Allow user to specify page limit
	// TODO: Set a delay for requests to be made (one-two seconds)
	// TODO: Allow user to add/remove games to wishlist (server update needed)
	//  - Allow them to view wishlist independently of their profile too?
	const {page} = useParams();
	const {token, role} = useContext(AuthContext)
	const [games, setGames] = useState(null);
	const [currentPage, setPage] = useState(1);
	const [filterActive, setFilterActive] = useState(false)
	const [searchBy, setSearchBy] = useState("Name")
	const [searchQuery, setSearchQuery] = useState({query: ""})
	const [sortBy, setSortBy] = useState("AppID")
	const [sortDirection, setSortDirection] = useState("Ascending")
	const [adultFilter, setAdultFilter] = useState(true)
	const [searchError, setSearchError] = useState(null)

	const handleSearch = (e) => {
		let name = e.target.name;
		let value = e.target.value;

		setSearchQuery(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	let URL, authHeaders, builtSearchQuery, builtSortQuery

	if(token){
		URL = 'https://fruity-steam.vercel.app/api/games'
		authHeaders = { headers: { "Authorization": `Bearer ${token}`}}
	} else {
		URL = 'https://fruity-steam.vercel.app/api/games/names'
		authHeaders = ''
	}

	if(filterActive){
		builtSearchQuery = `&by=${searchBy}&query=${searchQuery.query}`
		builtSortQuery = `&sort=${sortBy}&direction=${sortDirection}`
	} else {
		builtSearchQuery = ''
		builtSortQuery = ''
	}

	useEffect(() => {
		axios.get(`${URL}?page=${currentPage}${builtSearchQuery}${builtSortQuery}`, authHeaders)
			.then((response) => {
				let data = response.data.data
				if(adultFilter){
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
				setSearchError(null)
				// setPage(Number(page))
			})
			.catch((err) => {
				console.error(err);
				console.log("ERROR: ", err.response.data.msg)
				setSearchError(err.response.data.msg)
			});
	}, [URL, currentPage, builtSearchQuery, builtSortQuery, adultFilter]);

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
	let searchByOptions, sortByOptions
	if(token){
		searchByOptions = authenticatedOptions
		sortByOptions = authenticatedOptions
	} else {
		searchByOptions = unauthenticatedOptions
		sortByOptions = unauthenticatedOptions
	}

	let sortDirectionOptions = [
		{
			"value" : "Ascending",
			"label" : "Ascending"
		},
		{
			"value" : "Descending",
			"label" : "Descending"
		}
	]

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
				<TableHeadCell>View</TableHeadCell>
			</>
		)
	}

	let adminTableHeaders
	if(role==='admin'){
		adminTableHeaders = (
			<>
				<TableHeadCell>Edit</TableHeadCell>
				<TableHeadCell>Delete</TableHeadCell>
			</>
			)
	}

	const adultFilterConfirm = () => {
		if(adultFilter){
			if (window.confirm("Do you confirm that you are over 18 years of age?") === true){
				setAdultFilter(!adultFilter)
			}
		}
		else {
			setAdultFilter(!adultFilter)
		}
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
						{ role === 'admin' &&
							<Button
								style={{marginBottom: '1rem'}}
								fullWidth
							>
								Add New Game
							</Button>
						}
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
							<>
								<GroupBox label='Search' style={{display: 'flex', marginBottom: '1rem'}}>
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
								</GroupBox>
								<GroupBox label='Sort' style={{display: 'flex', marginBottom: '1rem'}}>
									<Select
										defaultValue={"AppID"}
										width={'100%'}
										menuMaxHeight={200}
										options={sortByOptions}
										onChange={e => setSortBy(e.value)}
									/>
									<Select
										defaultValue={"Ascending"}
										width={250}
										menuMaxHeight={200}
										options={sortDirectionOptions}
										onChange={e => setSortDirection(e.value)}
									/>
								</GroupBox>
								{/* TODO: Limit & Page Selector Here! */}
								<GroupBox label='Adult Content Filter' style={{width: '40%', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
									{adultFilter ? (
										<p style={{fontSize: '1.2rem', marginTop: '0.2rem'}}>Filter Is Enabled</p>
									) : (
										<p style={{fontSize: '1.2rem', marginTop: '0.2rem'}}>Filter Is Disabled</p>
									)}
									<Button
										onClick={adultFilterConfirm}
										active={adultFilter}
										square
									>
										{adultFilter ? (
											<p>✔</p>
										) : (
											<p>X</p>
										)}
									</Button>
								</GroupBox>
							</>
						}
						{!searchError ? (
						<>
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
										{ adminTableHeaders }
									</TableRow>
								</TableHead>
								<TableBody>
									{gamesList}
								</TableBody>
							</Table>
						</>
						) : (
							<div style={{display: 'flex', justifyContent: 'center'}}>
								<p style={{fontSize: '2rem'}}>{searchError}!</p>
							</div>
						)}

					</WindowContent>
				</Window>
			</div>
		</>
	);
};

export default Index;
