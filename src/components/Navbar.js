import {Link, useLocation} from 'react-router-dom';
import {AppBar, Button, Frame, Toolbar} from 'react95';
import {useState} from "react";
import ic_mangows from "./icons/ic_mangows.png"
import ic_computer from "./icons/ic_computer.ico"
import ic_msdos from "./icons/ic_msdos.ico"
import Clock from 'react-live-clock';

const Navbar = () => {
	const [open, setOpen] = useState(false);
	const location = useLocation()
	// console.log("Current location = ", location.pathname)
	let betweenSlashes = location.pathname.split('/')[1]
	// console.log(betweenSlashes)
	return (
		<AppBar position="sticky" style={{zIndex: 100, marginBottom: '1rem'}}>
			<Toolbar style={{position: 'relative', justifyContent: 'space-between'}}>
				<div style={{margin: 0, padding: 0}}>
					<Button
						onClick={() => setOpen(!open)}
						active={open}
						style={{fontWeight: 'bold', marginRight: '0.5rem'}}
						size="lg"
					>
						<img
							src={ic_mangows}
							alt='mangows95 logo'
							style={{height: '24px', marginRight: 4}}
						/>
						Start
					</Button>
					<Link to='/'>
						<Button
							active={location.pathname==='/'}
							size="lg"
							style={{marginRight: '0.5rem'}}
						>
							<img
							src={ic_computer}
							alt='mangows95 logo'
							style={{height: '24px', marginRight: 4}}
							/>
							Home
						</Button>
					</Link>
					<Link to='/games/'>
						<Button
							active={location.pathname==='/games/'}
							size="lg"
							style={{marginRight: '0.5rem'}}
						>
							<img
							src={ic_msdos}
							alt='mangows95 logo'
							style={{height: '24px', marginRight: 4}}
							/>
							Games
						</Button>
					</Link>
					{
						betweenSlashes==='game' &&
						<Button
							active={betweenSlashes==='game'}
							size="lg"
						>
							<img
								src={ic_msdos}
								alt='mangows95 logo'
								style={{height: '24px', marginRight: 4}}
							/>
							Game Name
						</Button>
					}
				</div>
				<Frame variant='well' style={{marginRight: '0.5rem', padding: '0.2rem'}}>
					<Clock format={'h:mm A'} ticking={true} interval={60}/>
				</Frame>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
