import axios from 'axios';
import {useState, useEffect, useContext, useRef} from 'react';
import {AuthContext} from "../../AuthContext";
import UserCard from '../../components/UserCard';
import {Link, useParams} from "react-router-dom";
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

import options from './json/options.json'
import ResponsiveWrapper from "../../components/ResponsiveWrapper";

const Index = () => {
	// TODO: Allow user to add/remove games to wishlist (server update needed)
	//  - Allow them to view wishlist independently of their profile too?
	const {page} = useParams();
	const {token, role} = useContext(AuthContext)
	const [users, setUsers] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [filterActive, setFilterActive] = useState(false)
	const [searchBy, setSearchBy] = useState("username")
	const [searchQuery, setSearchQuery] = useState({query: ""})
	const [sortBy, setSortBy] = useState("createdAt")
	const [sortDirection, setSortDirection] = useState("Descending")
	const [searchError, setSearchError] = useState(null)
	const [limit, setLimit] = useState(100)
	const [totalGames, setTotalGames] = useState(0)
	const [totalPages, setTotalPages] = useState(0)

	const ref = useRef(null)

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

	URL = 'https://fruity-steam.vercel.app/api/users'
	authHeaders = { headers: { "Authorization": `Bearer ${token}`}}

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

	// TODO: IMPORTANT!!! Set a delay for requests to be made (one-two seconds)
	// TODO: Figure out fix / error message for when MongoDB memory limit reached
	//  - Could also reduce available limits to 25ish max
	useEffect(() => {
		console.log(`Built Query: ${URL}${builtLimitQuery}${builtSearchQuery}${builtSortQuery}${builtPageQuery}`)
		axios.get(`${URL}${builtLimitQuery}${builtSearchQuery}${builtSortQuery}${builtPageQuery}`, authHeaders)
			.then((response) => {
				// TODO: While loading show hourglass animation
				// console.log("Full response data: ",response.data)
				let data = response.data.data
				let totalGames = Number.parseInt(response.data.total)
				console.log("Total users: ", totalGames)
				console.log("Limit: ", limit)
				console.log("Max pages: ", Math.ceil(totalGames/limit))
				setTotalGames(totalGames)
				setTotalPages(Math.ceil(totalGames/limit))

				setUsers(data);
				console.log(data);

				setSearchError(null)
				// setPage(Number(page))
			})
			.catch((err) => {
				console.error(err);
				console.log("ERROR: ", err.response)
				setSearchError('No users found')
			});
	}, [URL, currentPage, builtSearchQuery, builtSortQuery, limit]);

	if (!users) return (
		<div style={{display: "flex", justifyContent: 'center'}}>
			<Window style={{width: "250px"}}>
				<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
					<span style={{marginLeft: '0.2rem'}}>Users.exe</span>
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

	const usersList = users.map((user) => {
		return <UserCard user={user} key={user._id} users={users} setUsers={setUsers}/>;
	});

	// Creating list of options for select box
	let searchByOptions = options
	let sortByOptions = options

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

	return (
		<>
			<div style={{display: "flex", justifyContent: 'center'}}>
				<ResponsiveWrapper>
					<Window style={{width: "100%"}}>
						<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
							<span style={{marginLeft: '0.2rem'}}>Users.exe</span>
							<Link to='/'>
								<Button style={{marginTop: '0.2rem'}}>X</Button>
							</Link>
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
													width={250}
													options={limitOptions}
													onChange={e => setLimit(e.value)}
												/>

											</div>
										</GroupBox>
										<GroupBox label={'Page'} style={halfSizeGroupRight}>
											<div style={{display: 'flex', justifyContent: 'space-between'}}>
												<NumberInput
													width={250}
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
								<p>Total users: {totalGames}</p>
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
							{!searchError ? (
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
									<p style={{fontSize: '2rem'}}>{searchError}!</p>
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
