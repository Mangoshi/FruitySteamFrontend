import {Anchor, Button, Frame, GroupBox, Window, WindowContent, WindowHeader} from 'react95';
import {useNavigate} from "react-router-dom";
import ResponsiveWrapper from "./ResponsiveWrapper";
import {useContext} from "react";
import {AuthContext} from "../AuthContext";

const UserCardDetailed = ({user}) => {

	const navigate = useNavigate()
	const { role } = useContext(AuthContext)

	let createdAtDate = new Date(user.createdAt).toLocaleDateString()
	let createdAtTime = new Date(user.createdAt).toLocaleTimeString()

	let updatedAtDate = new Date(user.updatedAt).toLocaleDateString()
	let updatedAtTime = new Date(user.updatedAt).toLocaleTimeString()

	console.log(user.wishlist)
	let formattedWishlist
	if(user.wishlist.length !== 0){
		formattedWishlist = user.wishlist.map((game) => {
			return (
				<li key={game._id} style={{
					border: '2px solid grey',
					borderRadius: 8,
					marginBottom: '0.5rem',
					padding: 4
				}}>
					<div style={{display: 'flex', justifyContent: 'space-between'}}>
						<Anchor href={`/games/id/${game._id}`} target="_blank" rel="noreferrer">
							{game.Name}
						</Anchor>
						{/* TODO: Allow wishlist game removal with this */}
						<Button size={'sm'}>X</Button>
					</div>
				</li>
			)
		})
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
									{formattedWishlist ?
											<ol>
												{formattedWishlist}
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
							{/*	TODO: Make edit & back buttons functional! */}
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
