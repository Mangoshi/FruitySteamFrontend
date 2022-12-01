import {Link, useLocation} from 'react-router-dom';
import {AppBar, Button, Frame, MenuList, MenuListItem, Separator, Toolbar} from 'react95';
import {useContext, useState} from "react";
import {GameContext} from "../GameContext";
import Clock from 'react-live-clock';

import ic_mangows from "./icons/ic_mangows.png"
import ic_computer from "./icons/ic_computer.ico"
import ic_msdos from "./icons/ic_msdos.ico"
import ic_folder_exe from "./icons/ic_folder_exe.ico"
import ic_user from "./icons/ic_user.ico"
import ic_settings from "./icons/ic_settings.ico"
import ic_auth from "./icons/ic_auth.ico"
import {useAuth} from "../useAuth";

const Navbar = () => {
	const { logout } = useAuth()
	// State for start menu
	const [open, setOpen] = useState(false);

	// Using GameContext to update viewed game tab
	const {game} = useContext(GameContext)

	// Limiting game title to 20 characters in length
	let limitedTitle = game
	if (game && game.length > 20) {
		limitedTitle = game.substring(0, 20) + "..."
	}

	// useLocation to reveal Router data
	const location = useLocation()
	// console.log("Current location = ", location.pathname)

	// gameViewActive boolean to tell if viewing game or not
	let gameViewActive = location.pathname.includes('/game/')
	// console.log(gameViewActive)

	// TODO: Settings start menu option goes to theme settings somehow?
	// TODO: User start menu option goes to api/users/me
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
					{open && (
						<MenuList
							style={{
								position: 'absolute',
								left: '0',
								top: '100%'
							}}
							onClick={() => setOpen(false)}
						>
							<MenuListItem>
								<img
									src={ic_user}
									alt='mangows95 logo'
									style={{height: '24px', marginRight: 4}}
								/>
								Profile
							</MenuListItem>
							<MenuListItem>
								<img
									src={ic_settings}
									alt='mangows95 logo'
									style={{height: '24px', marginRight: 4}}
								/>
								Settings
							</MenuListItem>
							<Separator/>
							<MenuListItem
								onClick={logout}
							>
								<img
									src={ic_auth}
									alt='mangows95 logo'
									style={{height: '24px', marginRight: 4}}
								/>
								Logout
							</MenuListItem>
						</MenuList>
					)}
					<Link to='/'>
						<Button
							active={location.pathname === '/'}
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
							active={location.pathname === '/games/'}
							size="lg"
							style={{marginRight: '0.5rem'}}
						>
							<img
								src={ic_folder_exe}
								alt='mangows95 logo'
								style={{height: '24px', marginRight: 4}}
							/>
							Games
						</Button>
					</Link>
					{
						gameViewActive &&
						<Button
							active={gameViewActive}
							size="lg"
						>
							<img
								src={ic_msdos}
								alt='mangows95 logo'
								style={{height: '24px', marginRight: 4}}
							/>
							{game && gameViewActive ? limitedTitle : 'Game Name'}
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
