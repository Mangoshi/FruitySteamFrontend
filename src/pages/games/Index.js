// GameCard import
import GameCard from '../../components/GameCard';

// UI imports
import {
	Button, Frame,
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

// React Router imports
import {Link, useNavigate, useParams} from "react-router-dom";

// HTTP request imports
import axios from 'axios';

// State imports
import {useState, useEffect, useContext} from 'react';
import {AuthContext} from "../../AuthContext";

// JSON imports
import authenticatedOptions from './json/authenticatedOptions.json'
import unauthenticatedOptions from './json/unauthenticatedOptions.json'

const Index = () => {
	// Page variable from URL params
	const {page} = useParams();
	// Token and role from AuthContext
	const {token, role} = useContext(AuthContext)
	// State variables for games HTTP requests
	const [games, setGames] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [searchBy, setSearchBy] = useState("Name")
	const [searchQuery, setSearchQuery] = useState({query: ""})
	const [sortBy, setSortBy] = useState("AppID")
	const [sortDirection, setSortDirection] = useState("Ascending")
	const [limit, setLimit] = useState(100)
	const [filterActive, setFilterActive] = useState(false)
	const [adultFilter, setAdultFilter] = useState(true)
	const [isLoaded, setIsLoaded] = useState(false)
	const [totalGames, setTotalGames] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const [searchError, setSearchError] = useState(null)

	// useNavigate hook to handle redirects
	const navigate = useNavigate()

	// If page param passed, set currentPage state to that page
	if(page){
		setCurrentPage(Number(page))
	}

	// Options available to limit number of games displayed
	const limitOptions = [
		{value: 10, label: "10"},
		{value: 25, label: "25"},
		{value: 50, label: "50"},
		{value: 100, label: "100"},
		{value: 250, label: "250"},
		{value: 500, label: "500"},
		{value: 1000, label: "1000"},
	]

	// Function to handle search query changes
	const handleSearch = (e) => {
		let name = e.target.name;
		let value = e.target.value;

		setSearchQuery(prevState => ({
			...prevState,
			[name]: value
		}))

		// Also resets current page to page 1
		setCurrentPage(1)
	};

	// Initialising variables needed for filtered HTTP request
	let URL,
		authHeaders,
		builtSearchQuery,
		builtSortQuery,
		builtLimitQuery,
		builtPageQuery

	// If user is authenticated, set URL to /api/games & authHeaders to token
	// Else if user is not authenticated, set URL to /api/games/names & authHeaders to null
	if(token){
		URL = 'https://fruity-steam.vercel.app/api/games'
		authHeaders = { headers: { "Authorization": `Bearer ${token}`}}
	} else {
		URL = 'https://fruity-steam.vercel.app/api/games/names'
		authHeaders = ''
	}

	// If the filter is active, build the search query
	// Else if the filter is not active, set the search queries to null (except for page)
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

	// Games GET request
	useEffect(() => {
		// console.log(`Built Query: ${URL}${builtLimitQuery}${builtSearchQuery}${builtSortQuery}${builtPageQuery}`)
		// Async function to handle HTTP request
		const fetchData = async () => {
			// Await the response from the HTTP request
			await axios.get(`${URL}${builtLimitQuery}${builtSearchQuery}${builtSortQuery}${builtPageQuery}`, authHeaders)
				.then((response) => {
					// console.log("Full response data: ",response.data)
					// Initialise data variable to response data
					let data = response.data.data
					// Initialise totalGames variable to total number of games
					let totalGames = Number.parseInt(response.data.total)
					// console.log("Total games: ", totalGames)
					// console.log("Limit: ", limit)
					// console.log("Max pages: ", Math.ceil(totalGames / limit))
					// Set totalGames state to total number of games
					setTotalGames(totalGames)
					// Set totalPages state to max number of pages based on totalGames and limit
					setTotalPages(Math.ceil(totalGames / limit))
					// If the adult filter is active, filter out games with adult content
					// (These all have the "Notes" field)
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
						// Set games state to filtered array
						setGames(data.filter(game => !game.Notes))
						// console.log(data.filter(game => !game.Notes))
					} else {
						// Set games state to data
						setGames(data);
						// console.log(data);
					}
					// Set isLoaded state to true
					setIsLoaded(true)
					// Set searchError state to null
					setSearchError(null)
					// setPage(Number(page))
				})
				// Catch any errors
				.catch((err) => {
					console.error(err);
					console.log("ERROR: ", err.response.data.msg)
					setSearchError(err.response.data.msg+"!")
				});
		}

		// Initialising a 250ms timer to prevent too many requests
		const timer = setTimeout(() => {
			setIsLoaded(false)
			fetchData()
		}, 250)

		// Clearing the timer on unmount
		return () => clearTimeout(timer)

	}, [URL, currentPage, builtSearchQuery, builtSortQuery, adultFilter, limit]);

	// If there are no games, display loading animation
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

	// If there are games, map them as GameCard components
	const gamesList = games.map((game) => {
		return <GameCard game={game} key={game._id} games={games} setGames={setGames}/>;
	});

	// Creating list of options for select box
	let searchByOptions, sortByOptions

	// If user is authenticated, show all options
	// If user is not authenticated, only show AppID & Name options
	if(token){
		searchByOptions = authenticatedOptions
		sortByOptions = authenticatedOptions
	} else {
		searchByOptions = unauthenticatedOptions
		sortByOptions = unauthenticatedOptions
	}

	// Defining the sortDirection options
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

	// If user is not authenticated, show a message
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

	// If user is authenticated, include the view table header
	let authenticatedTableHeaders
	if(token){
		authenticatedTableHeaders = (
			<>
				<TableHeadCell>View</TableHeadCell>
			</>
		)
	}

	// If user is an admin, include edit and delete table headers
	let adminTableHeaders
	if(role==='admin'){
		adminTableHeaders = (
			<>
				<TableHeadCell>Edit</TableHeadCell>
				<TableHeadCell>Delete</TableHeadCell>
			</>
			)
	}

	// Function to confirm user wishes to disable adult content filter
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

	// Container style variables
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

	// Custom styles to mimic the Windows 95 input field
	const numInputFrame = {
		padding: 1,
		width: '100%',
		height: '2.2rem',
	}
	const numInputStyles = {
		width: '90%',
		height: '1.5rem',
		marginTop: 1,
		marginLeft: 8,
		border: 'none',
		outline: 'none',
		fontSize: '1rem',
		font: 'unset',
		backgroundColor: 'white',
	}

	// Function to enforce a number input
	const onlyAllowNumber = (input) => {
		const regex = new RegExp("^[0-9]*$");
		if (input.data != null && !regex.test(input.data))
			input.preventDefault();
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
											<Frame variant={"field"} style={numInputFrame}>
												<input
													width={150}
													value={currentPage}
													min={1}
													max={totalPages}
													onChange={e => setCurrentPage(e.target.value)}
													onBeforeInput={onlyAllowNumber}
													style={numInputStyles}
													/>
											</Frame>
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
								{Number(currentPage) > 1 ? (
									<Button size='sm' onClick={() => setCurrentPage(Number(currentPage) - 1)}> {"<<"} </Button>
								) : (
									<Button size='sm' disabled> {"<<"} </Button>
								)
								}
							</div>
							{/* Numeric Block*/}
							<div>
								{/* 2 before */}
								{Number(currentPage) === 2 &&
									<Button size='sm' onClick={() => setCurrentPage(Number(currentPage) - 1)}>{Number(currentPage) - 1}</Button>
								}
								{Number(currentPage) > 2 &&
									<>
										<Button size='sm' onClick={() => setCurrentPage(Number(currentPage) - 2)}>{Number(currentPage) - 2}</Button>
										<Button size='sm' onClick={() => setCurrentPage(Number(currentPage) - 1)}>{Number(currentPage) - 1}</Button>
									</>
								}
								{/* Current page */}
								{Number(currentPage) > 0 ?
									<Button size='sm' active>{currentPage}</Button>
									:
									null
								}
								{/* 2 after */}
								{Number(currentPage) < totalPages &&
									<Button size='sm' onClick={() => setCurrentPage(Number(currentPage) + 1)}>{Number(currentPage) + 1}</Button>
								}
								{Number(currentPage) < totalPages - 1 &&
									<Button size='sm' onClick={() => setCurrentPage(Number(currentPage) + 2)}>{Number(currentPage) + 2}</Button>
								}
							</div>
							{/* Next Block */}
							<div>
								{/* If page is less than total games / limit, activate forward button */}
								{Number(currentPage) < totalPages ? (
									<Button size='sm' onClick={() => setCurrentPage(Number(currentPage) + 1)}> {">>"} </Button>
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
