// UI imports
import UserCard from '../../components/UserCard';
import {
	Button, Frame,
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
import ResponsiveWrapper from "../../components/ResponsiveWrapper";

// React Router imports
import {Link, useNavigate, useParams} from "react-router-dom";

// HTTP request imports
import axios from 'axios';

// State imports
import {useState, useEffect, useContext, useRef} from 'react';
import {AuthContext} from "../../AuthContext";

// JSON imports
import options from './json/options.json'

const Index = () => {
	// Page variable from URL params
	const {page} = useParams();
	// Token and role from AuthContext
	const {token, role} = useContext(AuthContext)
	// State variables for users HTTP requests
	const [users, setUsers] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchBy, setSearchBy] = useState("username")
	const [searchQuery, setSearchQuery] = useState({query: ""})
	const [sortBy, setSortBy] = useState("createdAt")
	const [sortDirection, setSortDirection] = useState("Descending")
	const [limit, setLimit] = useState(100)
	const [filterActive, setFilterActive] = useState(false)
	const [isLoaded, setIsLoaded] = useState(false)
	const [totalUsers, setTotalUsers] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const [searchError, setSearchError] = useState(null)

	// useNavigate hook to handle redirects
	const navigate = useNavigate()

	// If page param is passed, set currentPage to that page
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
		}));

		// Also resets current page to 1
		setCurrentPage(1)
	};

	// Initialising variables needed for filtered HTTP request
	let URL,
		authHeaders,
		builtSearchQuery,
		builtSortQuery,
		builtLimitQuery,
		builtPageQuery

	// Initialising URL and authHeaders
	URL = 'https://fruity-steam.vercel.app/api/users'
	authHeaders = { headers: { "Authorization": `Bearer ${token}`}}

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

	// Users GET request
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
					// Initialise totalUsers variable to total users
					let totalUsers = Number.parseInt(response.data.total)
					// console.log("Total users: ", totalUsers)
					// console.log("Limit: ", limit)
					// console.log("Max pages: ", Math.ceil(totalUsers / limit))
					// Set totalUsers state variable to total users
					setTotalUsers(totalUsers)
					// Set totalPages state variable to max pages based on total users and limit
					setTotalPages(Math.ceil(totalUsers / limit))
					// Set users state variable to data
					setUsers(data);
					// console.log(data);
					// Set isLoaded state variable to true
					setIsLoaded(true)
					// Set searchError state variable to null
					setSearchError(null)
					// setPage(Number(page))
				})
				// Catch any errors
				.catch((err) => {
					console.error(err);
					console.log("ERROR: ", err.response)
					setSearchError('No users found!')
				});
		}

		// Initialising a 250ms timer to prevent too many requests
		const timer = setTimeout(() => {
			setIsLoaded(false)
			fetchData()
		}, 250)

		// Clear the timer on unmount
		return () => clearTimeout(timer)

	}, [URL, currentPage, builtSearchQuery, builtSortQuery, limit]);

	// If there are no users, display loading animation
	if (!users) return (
		<div style={{display: "flex", justifyContent: 'center'}}>
			<Window style={{width: "250px"}}>
				<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
					<span style={{marginLeft: '0.2rem'}}>Users.exe</span>
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

	// If there are users, map them to as UserCard components
	const usersList = users.map((user) => {
		return <UserCard user={user} key={user._id} users={users} setUsers={setUsers}/>;
	});

	// Creating list of options for select box
	let searchByOptions = options
	let sortByOptions = options

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
				<ResponsiveWrapper>
					<Window style={{width: "100%"}}>
						<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
							<span style={{marginLeft: '0.2rem'}}>Users.exe</span>
							<Button style={{marginTop: '0.2rem'}} onClick={() => navigate(-1)}>X</Button>
						</WindowHeader>
						<WindowContent>
							{ role === 'admin' &&
								<Link to='/users/add'>
									<Button
										style={{marginBottom: '1rem'}}
										fullWidth
									>
										Add New User
									</Button>
								</Link>
							}
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
											defaultValue={sortBy}
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
										<GroupBox label={'Limit'} style={halfSizeGroupLeft}>
											<div style={{display: 'flex', justifyContent: 'space-between'}}>
												<Select
													defaultValue={limit}
													menuMaxHeight={200}
													width={'100%'}
													options={limitOptions}
													onChange={e => setLimit(e.value)}
												/>

											</div>
										</GroupBox>
										<GroupBox label={'Page'} style={halfSizeGroupRight}>
											<div style={{display: 'flex', justifyContent: 'space-between'}}>
												<Frame variant={"field"} style={numInputFrame}>
													<input
														width={'100%'}
														value={currentPage}
														min={1}
														max={totalPages}
														onChange={e => {setCurrentPage(e.target.value)}}
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
								<p>Total users: {totalUsers}</p>
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
												<TableHeadCell>View</TableHeadCell>
												<TableHeadCell>Edit</TableHeadCell>
												<TableHeadCell>Delete</TableHeadCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{usersList}
										</TableBody>
									</Table>
								</>
							) : (
								<div style={{display: 'flex', justifyContent: 'center'}}>
									<p style={{fontSize: '2rem'}}>{searchError}</p>
								</div>
							)}

						</WindowContent>
					</Window>
				</ResponsiveWrapper>
			</div>
		</>
	);
};

export default Index;
