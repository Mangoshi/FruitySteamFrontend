import {Link, useLocation} from 'react-router-dom';
import {useContext, useEffect, useState} from "react";
import {useAuth} from "../useAuth";
import {GameContext} from "../GameContext";
import {AuthContext} from "../AuthContext";

import Clock from 'react-live-clock';
import {AppBar, Button, Frame, MenuList, MenuListItem, Separator, Toolbar} from 'react95';
import ic_mangows from "./icons/ic_mangows.png"
import ic_computer from "./icons/ic_computer.ico"
import ic_msdos from "./icons/ic_msdos.ico"
import ic_folder_exe from "./icons/ic_folder_exe.ico"
import ic_user from "./icons/ic_user.png"
import ic_auth from "./icons/ic_auth.ico"
import ic_users from "./icons/ic_users.png"
import {UserContext} from "../UserContext";

const Navbar = () => {
	const { logout } = useAuth()
	// State for start menu
	const [open, setOpen] = useState(false);

	// Using AuthContext to check if user is admin
	const {token, role} = useContext(AuthContext)

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
	let urlArray = location.pathname.split("/")
	// console.log("urlArray = ", urlArray)

	// gameViewActive boolean to tell if viewing game or not
	let gameViewActive = urlArray[1] === "games" && (urlArray[2] === "id" || urlArray[2] === "edit")
	// console.log(gameViewActive)

	const {user} = useContext(UserContext)

	console.log("user = ", user)
	let limitedName = user
	if (user && user.length > 20) {
		limitedName = user.substring(0, 20) + "..."
		console.log(limitedName)
	}

	let userViewActive = urlArray[1] === "users" && (urlArray[2] === "id" || urlArray[2] === "edit")

	let meViewActive = urlArray[1] === "me"

	const [width, setWidth] = useState(window.innerWidth);
	const breakpoint = 725;
	useEffect(() => {
		const handleResizeWindow = () => setWidth(window.innerWidth);
		// subscribe to window resize event "onComponentDidMount"
		window.addEventListener("resize", handleResizeWindow);
		return () => {
			// unsubscribe "onComponentDestroy"
			window.removeEventListener("resize", handleResizeWindow);
		};
	}, []);

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
							alt='alt Windows 95 logo'
							style={{height: '24px', marginRight: 4}}
						/>
						{width > breakpoint && <p>Start</p>}
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
							{ token ?
								<>
									<Link to='/me'>
										<MenuListItem>
											<img
												src={ic_user}
												alt='user icon'
												style={{height: '24px', marginRight: 4}}
											/>
											Profile
										</MenuListItem>
									</Link>
									<Separator/>
									<MenuListItem
										onClick={logout}
									>
										<img
											src={ic_auth}
											alt='keys icon'
											style={{height: '24px', marginRight: 4}}
										/>
										Logout
									</MenuListItem>
								</>
								:
								<>
									<MenuListItem>
										<img
											src={ic_user}
											alt='user icon'
											style={{height: '24px', marginRight: 4}}
										/>
										Please login!
									</MenuListItem>
								</>
							}
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
								alt='computer icon'
								style={{height: '24px', marginRight: 4}}
							/>
							{width > breakpoint && <p>Home</p>}
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
								alt='folder icon'
								style={{height: '24px', marginRight: 4}}
							/>
							{width > breakpoint && <p>Games</p>}
						</Button>
					</Link>
					{role === 'admin' &&
						<Link to='/users/'>
							<Button
								active={location.pathname === '/users/'}
								size="lg"
								style={{marginRight: '0.5rem'}}
							>
								<img
									src={ic_users}
									alt='user icon'
									style={{height: '24px', marginRight: 4}}
								/>
								{width > breakpoint && <p>Users</p>}
							</Button>
						</Link>
					}
					{gameViewActive &&
						<>
							{width > breakpoint ?
								<Button
									active={gameViewActive}
									size="lg"
									style={{marginRight: '0.5rem'}}
								>
									<img
										src={ic_msdos}
										alt='ms-dos icon'
										style={{height: '24px', marginRight: 4}}
									/>
									{game && gameViewActive ? limitedTitle : 'Game Name'}
								</Button>
							:
								<Button
									active={gameViewActive}
									size="lg"
									style={{marginRight: '0.5rem'}}
								>
									<img
										src={ic_msdos}
										alt='ms-dos icon'
										style={{height: '24px', marginRight: 4}}
									/>
								</Button>
							}
						</>
					}
					{
						role === 'admin' && userViewActive &&
						<>
							{width > breakpoint ?
								<Button
									active={userViewActive}
									size="lg"
								>
									<img
										src={ic_user}
										alt='user icon'
										style={{height: '24px', marginRight: 4}}
									/>
									{user && userViewActive ? limitedName : 'User Name'}
								</Button>
							:
								<Button
									active={userViewActive}
									size="lg"
								>
									<img
										src={ic_user}
										alt='user icon'
										style={{height: '24px', marginRight: 4}}
									/>
								</Button>
							}
						</>
					}
					{
						meViewActive &&
						<>
							{width > breakpoint ?
								<Button
									active={meViewActive}
									size="lg"
								>
									<img
										src={ic_user}
										alt='user icon'
										style={{height: '24px', marginRight: 4}}
									/>
									{'Me'}
								</Button>
							:
								<Button
									active={meViewActive}
									size="lg"
								>
									<img
										src={ic_user}
										alt='user icon'
										style={{height: '24px', marginRight: 4}}
									/>
								</Button>
							}
						</>
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
