// Import React Router stuff
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import React state stuff
import {useState} from "react";
import {GameContext} from "./GameContext";

// Import React95 bits
import { styleReset } from 'react95';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

// Pick React95 theme
import raspberry from 'react95/dist/themes/raspberry';

// Import original Windows 95 font
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

// Import pages
import Home from './pages/Home';
import GamesIndex from './pages/games/Index';
import GamesShow from './pages/games/Show';

// Import components
import Navbar from './components/Navbar';

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

	const [game, setGame] = useState(null);

	return (
		<GameContext.Provider value={{
			game, setGame
		}}>
			<Router>
				<GlobalStyles />
				<ThemeProvider theme={raspberry}>
					<Navbar/>
					<Routes>
						<Route path="/" element={<Home/>}/>
						<Route path="/games/" element={<GamesIndex/>}/>
						<Route path="/game/:id" element={<GamesShow/>}/>
						<Route path="*" element={<Home />}/>
					</Routes>
				</ThemeProvider>
			</Router>
		</GameContext.Provider>
	);
};

export default App;
