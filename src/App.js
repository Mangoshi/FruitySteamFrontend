import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//import pages
import Home from './pages/Home';
import GamesIndex from './pages/games/Index';
import GamesShow from './pages/games/Show';

//import components
import Navbar from './components/Navbar';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<GamesIndex />} />
                <Route path="/games/:id" element={<GamesShow />} />
            </Routes>
        </Router>
    );
};

export default App;
