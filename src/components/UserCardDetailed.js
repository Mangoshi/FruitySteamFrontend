// UI imports
import {Button, Frame, GroupBox, Window, WindowContent, WindowHeader} from 'react95';
import ResponsiveWrapper from "./ResponsiveWrapper";

// React Router imports
import {Link, useNavigate} from "react-router-dom";

// HTTP request imports
import axios from "axios";

// State imports
import {useContext, useState} from "react";
import {AuthContext} from "../AuthContext";
import {useUser} from "../useUser";

const UserCardDetailed = ({user}) => {

	// Using navigate to handle redirects
	const navigate = useNavigate()

	// Using AuthContext to check user-related state
	const { role, token } = useContext(AuthContext)

	// Initialising wishlist state
	const [wishlist, setWishlist] = useState(user.wishlist)

	// Importing updateUser function from useUser hook
	const { updateUserState } = useUser()
	// Setting user state to viewed user
	updateUserState(user.username)

	// Converting createdAt & updatedAt dates to readable formats
	let createdAtDate = new Date(user.createdAt).toLocaleDateString()
	let createdAtTime = new Date(user.createdAt).toLocaleTimeString()
	let updatedAtDate = new Date(user.updatedAt).toLocaleDateString()
	let updatedAtTime = new Date(user.updatedAt).toLocaleTimeString()

	// Function to remove game from wishlist
	function removeFromWishlist(gameID) {
		let newWishlist = wishlist.filter(entry => entry._id !== gameID)
		updateUser(newWishlist)
	}

	// Function to update user wishlist
	function updateUser(newWishlist) {
		axios.put(`https://fruity-steam.vercel.app/api/users/id/${user._id}`,
			{
				wishlist: newWishlist
			},
			{
				headers: {
					"Authorization": `Bearer ${token}`
				}})
			.then(response => {
				console.log(response.data);
				setWishlist(newWishlist)
			})
			.catch(err => {
				console.error(err);
				console.log(err.response.data.msg)
			});
	}

	// Function to format wishlist for rendering
	function formatWishlist(wishlist) {
		if(wishlist){
			return wishlist.map(entry => {
				return (
					<li key={entry._id} style={{
						border: '2px solid grey',
						borderRadius: 8,
						marginBottom: '0.5rem',
						padding: 4
					}}>
						<div key={entry._id} style={{display: 'flex', justifyContent: 'space-between'}}>
							<Link to={`/games/id/${entry._id}`}>
								{entry.Name}
							</Link>
							<Button size={'sm'} onClick={() => removeFromWishlist(entry._id)}>X</Button>
						</div>
					</li>
				)
			})
		}
		else {
			return null
		}
	}

	return (
		<div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
			<ResponsiveWrapper>
				<Window style={{width: '100%'}}>
					<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
						<span style={{marginLeft: '0.2rem'}}>{user.username}.exe</span>
						<Button style={{marginTop: '0.2rem'}} onClick={() => navigate(-1)}>X</Button>
					</WindowHeader>
					<WindowContent>
						<Frame variant='inside' style={{
							margin: '1rem',
							padding: '1rem',
							width: '94%'
						}}>
							<GroupBox label='Username' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{user.username}
								</span>
							</GroupBox>
							<GroupBox label='Email' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{user.email}
								</span>
							</GroupBox>
							<GroupBox label='Role' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{user.role}
								</span>
							</GroupBox>
							<GroupBox label='Wishlist' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{wishlist.length !== 0 ?
											<ol>
												{formatWishlist(wishlist)}
											</ol>
										: 'No games in wishlist'}
								</span>
							</GroupBox>
							<GroupBox label='Created At' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{createdAtDate} @ {createdAtTime}
								</span>
							</GroupBox>
							<GroupBox label='Updated At' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{updatedAtDate} @ {updatedAtTime}
								</span>
							</GroupBox>
							<div style={{display: 'flex', justifyContent: 'space-around'}}>
								<Button onClick={() => navigate(-1)}>BACK</Button>
								{role === 'admin' ?
									<Button onClick={() => navigate(`/users/edit/${user._id}`)}>EDIT</Button>
									:
									<Button onClick={() => navigate(`/me/edit/`)}>EDIT</Button>
								}
							</div>
						</Frame>
					</WindowContent>
				</Window>
			</ResponsiveWrapper>
		</div>
	)
}

export default UserCardDetailed
