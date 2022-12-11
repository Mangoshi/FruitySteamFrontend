import axios from 'axios';
import {useState, useEffect, useContext, useRef} from 'react';
import {AuthContext} from "../../AuthContext";
import GameCard from '../../components/GameCard';
import {Link, useNavigate, useParams} from "react-router-dom";
import {
	Button,
	GroupBox,
	Hourglass, NumberInput,
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
	// TODO: Allow user to add/remove games to wishlist (server update needed)
	//  - Allow them to view wishlist independently of their profile too?
	const {page} = useParams();
	const {token, role} = useContext(AuthContext)
	const [games, setGames] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterActive, setFilterActive] = useState(false)
	const [searchBy, setSearchBy] = useState("Name")
	const [searchQuery, setSearchQuery] = useState({query: ""})
	const [sortBy, setSortBy] = useState("AppID")
	const [sortDirection, setSortDirection] = useState("Ascending")
	const [adultFilter, setAdultFilter] = useState(true)
	const [searchError, setSearchError] = useState(null)
	const [limit, setLimit] = useState(100)
	const [totalGames, setTotalGames] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const [isLoaded, setIsLoaded] = useState(false)

	const ref = useRef(null)
	const navigate = useNavigate()

	if(page){
		setCurrentPage(Number(page))
	}

	const limitOptions = [
		{value: 10, label: "10"},
		{value: 25, label: "25"},
		{value: 50, label: "50"},
		{value: 100, label: "100"},
		{value: 250, label: "250"},
		{value: 500, label: "500"},
		{value: 1000, label: "1000"},
	]

	const handleSearch = (e) => {
		let name = e.target.name;
		let value = e.target.value;

		setSearchQuery(prevState => ({
			...prevState,
			[name]: value
		}));

		// TODO: Reset page to 1 when search query is changed
		//  - Currently doesn't change because using defaultValue instead of value
		// setCurrentPage(1)
		// document.getElementById("pageInput").value = 1
		// console.log(document.getElementById("pageInput"))
	};

	let URL, authHeaders, builtSearchQuery, builtSortQuery, builtLimitQuery, builtPageQuery

	if(token){
		URL = 'https://fruity-steam.vercel.app/api/games'
		authHeaders = { headers: { "Authorization": `Bearer ${token}`}}
	} else {
		URL = 'https://fruity-steam.vercel.app/api/games/names'
		authHeaders = ''
	}

	if(filterActive){
		builtLimitQuery = `?limit=${limit}`
		builtSearchQuery = `&by=${searchBy}&query=${searchQuery.query}`
		builtSortQuery = `&sort=${sortBy}&direction=${sortDirection}`
		builtPageQuery = `&page=${currentPage}`
	} else {
		builtLimitQuery = ''
		builtSearchQuery = ''
		builtSortQuery = ''
		builtPageQuery = `?page=${currentPage}`
	}

	// TODO: Figure out fix / error message for when MongoDB memory limit reached
	//  - Could also reduce available limits to 25ish max
	useEffect(() => {
		// console.log(`Built Query: ${URL}${builtLimitQuery}${builtSearchQuery}${builtSortQuery}${builtPageQuery}`)
		const fetchData = async () => {
			await axios.get(`${URL}${builtLimitQuery}${builtSearchQuery}${builtSortQuery}${builtPageQuery}`, authHeaders)
				.then((response) => {
					// TODO: While loading show hourglass animation
					// console.log("Full response data: ",response.data)
					let data = response.data.data
					let totalGames = Number.parseInt(response.data.total)
					console.log("Total games: ", totalGames)
					console.log("Limit: ", limit)
					console.log("Max pages: ", Math.ceil(totalGames / limit))
					setTotalGames(totalGames)
					setTotalPages(Math.ceil(totalGames / limit))
					if (adultFilter) {
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
					setIsLoaded(true)
					setSearchError(null)
					// setPage(Number(page))
				})
				.catch((err) => {
					console.error(err);
					console.log("ERROR: ", err.response.data.msg)
					setSearchError(err.response.data.msg+"!")
				});
		}

		const timer = setTimeout(() => {
			setIsLoaded(false)
			fetchData()
		}, 250)

		return () => clearTimeout(timer)

	}, [URL, currentPage, builtSearchQuery, builtSortQuery, adultFilter, limit]);

	if (!games) return (
		<div style={{display: "flex", justifyContent: 'center'}}>
			<Window style={{width: "250px"}}>
				<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
					<span style={{marginLeft: '0.2rem'}}>Games.exe</span>
					<Button style={{marginTop: '0.2rem'}} onClick={() => navigate(-1)}>X</Button>
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
		return <GameCard game={game} key={game._id} games={games} setGames={setGames}/>;
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

	const halfSizeGroupParent = {
		display: "flex",
		justifyContent: 'space-between'
	}

	const halfSizeGroupLeft = {
		marginBottom: '1rem',
		marginRight: '0.5rem',
		width: '100%'
	}

	const halfSizeGroupMiddle = {
		marginBottom: '1rem',
		marginRight: '0.25rem',
		marginLeft: '0.25rem',
		width: '100%'
	}

	const halfSizeGroupRight = {
		marginBottom: '1rem',
		marginLeft: '0.5rem',
		width: '100%'
	}

	return (
		<>
			<div style={{display: "flex", justifyContent: 'center'}}>
				<Window style={{width: "auto"}}>
					<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
						<span style={{marginLeft: '0.2rem'}}>Games.exe</span>
						<Button style={{marginTop: '0.2rem'}} onClick={() => navigate(-1)}>X</Button>
					</WindowHeader>
					<WindowContent>
						{ role === 'admin' &&
							<Link to='/games/add'>
								<Button
									style={{marginBottom: '1rem'}}
									fullWidth
								>
									Add New Game
								</Button>
							</Link>
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
										defaultValue={searchBy}
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
										defaultValue={sortDirection}
										width={250}
										menuMaxHeight={200}
										options={sortDirectionOptions}
										onChange={e => setSortDirection(e.value)}
									/>
								</GroupBox>
								<div style={halfSizeGroupParent}>
									<GroupBox label='Adult Content Filter' style={halfSizeGroupLeft}>
										<div style={{display: 'flex', justifyContent: 'space-between'}}>
											{adultFilter ? (
												<p style={{fontSize: '1rem', marginTop: '0.4rem', color: "green"}}>Filter Enabled</p>
											) : (
												<p style={{fontSize: '1rem', marginTop: '0.4rem', color: "darkred"}}>Filter Disabled</p>
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
										</div>
									</GroupBox>
									<GroupBox label={'Limit'} style={halfSizeGroupMiddle}>
										<div style={{display: 'flex', justifyContent: 'space-between'}}>
											<Select
												defaultValue={limit}
												menuMaxHeight={200}
												width={150}
												options={limitOptions}
												onChange={e => setLimit(e.value)}
											/>

										</div>
									</GroupBox>
									<GroupBox label={'Page'} style={halfSizeGroupRight}>
										<div style={{display: 'flex', justifyContent: 'space-between'}}>
											<NumberInput
												width={150}
												defaultValue={currentPage}
												ref={ref}
												id={'pageInput'}
												onChange={e => {setCurrentPage(e)}}
												min={1}
												max={totalPages}
												/>
										</div>
									</GroupBox>
								</div>
							</>
						}
						<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
							<p>Total games: {totalGames}</p>
							<p>Total pages: {totalPages}</p>
						</div>
						{/* Pagination div */}
						<div style={{display: 'flex', justifyContent: 'space-between'}}>
							{/* Previous Block*/}
							<div>
								{/* If page is greater than 1, activate back button */}
								{currentPage > 1 ? (
									<Button size='sm' onClick={() => setCurrentPage(currentPage - 1)}> {"<<"} </Button>
								) : (
									<Button size='sm' disabled> {"<<"} </Button>
								)
								}
							</div>
							{/* Numeric Block*/}
							<div>
								{/* 2 before */}
								{currentPage === 2 &&
									<Button size='sm' onClick={() => setCurrentPage(currentPage - 1)}>{currentPage - 1}</Button>
								}
								{currentPage > 2 &&
									<>
										<Button size='sm' onClick={() => setCurrentPage(currentPage - 2)}>{currentPage - 2}</Button>
										<Button size='sm' onClick={() => setCurrentPage(currentPage - 1)}>{currentPage - 1}</Button>
									</>
								}
								{/* Current page */}
								<Button size='sm' active>{currentPage}</Button>

								{/* 2 after */}
								{currentPage < totalPages &&
									<Button size='sm' onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 1}</Button>
								}
								{currentPage < totalPages - 1 &&
									<Button size='sm' onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 2}</Button>
								}
							</div>
							{/* Next Block */}
							<div>
								{/* If page is less than total games / limit, activate forward button */}
								{currentPage < totalPages ? (
									<Button size='sm' onClick={() => setCurrentPage(currentPage + 1)}> {">>"} </Button>
								) : (
									<Button size='sm' disabled> {">>"} </Button>
								)
								}
							</div>
						</div>
						{!isLoaded && !searchError && (
							<div style={{display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center', margin: '2rem'}}>
								<p style={{fontSize: '2rem'}}>Loading...</p>
								<Hourglass size={48} style={{ margin: 20 }}/>
							</div>
						)}
						{isLoaded && !searchError ? (
						<>
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
							<div style={{display: 'flex', justifyContent: 'center', margin: '2rem'}}>
								<p style={{fontSize: '2rem'}}>{searchError}</p>
							</div>
						)}
					</WindowContent>
				</Window>
			</div>
		</>
	);
};

export default Index;
