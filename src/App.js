// Import React Router stuff
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// Import state stuff
import {useState} from "react";
import {GameContext} from "./GameContext";
import {AuthContext} from "./AuthContext";
import {UserContext} from "./UserContext";

// Import React95 bits
import { styleReset } from 'react95';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

// TODO: Theme selector!
// Pick React95 theme
import themes from 'react95/dist/themes';

// Import original Windows 95 font
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

// Import pages
import Home from './pages/Home';
import GamesIndex from './pages/games/Index';
import GamesShow from './pages/games/Show';
import GamesAdd from './pages/games/Add.js'
import GamesEdit from './pages/games/Edit.js'
import UsersIndex from './pages/users/Index.js'
import UsersShow from './pages/users/Show.js'
import UsersAdd from './pages/users/Add.js'
import UsersEdit from './pages/users/Edit.js'

// Import components
import Navbar from './components/Navbar';

// TODO: Responsive styles, mobile-friendly
// Reset global styles
const GlobalStyles = createGlobalStyle`
	@font-face {
		font-family: 'ms_sans_serif';
		src: url('${ms_sans_serif}') format('woff2');
		font-weight: 400;
		font-style: normal
	}

	@font-face {
		font-family: 'ms_sans_serif';
		src: url('${ms_sans_serif_bold}') format('woff2');
		font-weight: bold;
		font-style: normal
	}

	body, input, select, textarea {
		font-family: 'ms_sans_serif', sans-serif;
		background-color: rgb(1,130,129);
	}
	${styleReset}
`;

const App = () => {

	// Initialising token state logic
	const [token, setToken] = useState(null)
	// Initialising role state logic
	const [role, setRole] = useState(null)

	// Defining routes that will only be included in the router if a token exists
	let authenticatedRoutes
	if(token){
		authenticatedRoutes = (
			<>
				<Route path="/games/id/:id" element={<GamesShow/>}/>
			</>
		)
	}

	// TODO: Admin routes (users, user/:id)
	let adminRoutes
	if(token && role==='admin') {
		adminRoutes = (
			<>
				<Route path="/games/add" element={<GamesAdd/>}/>
				<Route path="/games/edit/:id" element={<GamesEdit/>}/>
				<Route path="/users/" element={<UsersIndex/>}/>
				<Route path="/users/id/:id" element={<UsersShow/>}/>
				<Route path="/users/add" element={<UsersAdd/>}/>
				<Route path="/users/edit/:id" element={<UsersEdit/>}/>
			</>
		)
	}

	let localStorageTheme =
		localStorage.getItem('theme')
			? JSON.parse(localStorage.getItem('theme'))
			: themes.raspberry

	// Initialising game state logic
	const [game, setGame] = useState(null);

	const [user, setUser] = useState(null);

	const [theme, setTheme] = useState(localStorageTheme);

	return (
		<AuthContext.Provider value={{ token, setToken, role, setRole}}>
			<GameContext.Provider value={{ game, setGame }}>
				<UserContext.Provider value={{ user, setUser }}>
					<Router>
						<GlobalStyles />
						<ThemeProvider theme={theme}>
							<Navbar/>
							<Routes>
								<Route path="/" element={<Home theme={theme} setTheme={setTheme} themes={themes}/>}/>
								<Route path="/games/" element={<GamesIndex/>}/>
								{authenticatedRoutes}
								{adminRoutes}
								{/* Catch-all redirect */}
								<Route path="*" element={<Home />}/>
							</Routes>
						</ThemeProvider>
					</Router>
				</UserContext.Provider>
			</GameContext.Provider>
		</AuthContext.Provider>
	);
};

export default App;
