// UI imports
import { Button, TableDataCell, TableRow } from 'react95';

// React Router imports
import { Link } from 'react-router-dom';

// HTTP request imports
import axios from "axios";

// State imports
import { useUser } from "../useUser";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const UserCard = ({user, users, setUsers}) => {

	// Importing token context to check if logged-in
	const { token, role } = useContext(AuthContext)
	// Importing updateUserState function from useUser
	const { updateUserState } = useUser()

	// Conditional rendering of view button based on user authentication
	let viewButton
	if(token){
		viewButton = (
			<>
				<TableDataCell style={{ textAlign: 'center' }}>
					<Link to={`/users/id/${user._id}`}>
						{/* onClick: update user state with username */}
						<Button variant='flat' size='sm' onClick={() => updateUserState(user.username)}>
							<p
								style={{marginBottom: '0.2rem', fontSize: '1.25rem',}}
							>
								&#128065;
							</p>
						</Button>
					</Link>
				</TableDataCell>
			</>
		)
	}

	// Function to confirm deletion of user from database
	const deleteUserConfirm = (user) => {
		let result = window.confirm(`Are you sure you want to delete ${user.username}?`);
		if (result) {
			deleteUser(user._id);
		}
	}

	// Function to delete user from database
	const deleteUser = (id) => {
		axios.delete(`https://fruity-steam.vercel.app/api/users/id/${id}`, {
			headers: { "Authorization": `Bearer ${token}`}
		})
			.then((response) => {
				console.log(response);
				setUsers(users.filter(user => user._id !== id));
			})
			.catch((err) => {
				console.error(err);
			});
	}

	// Conditional rendering of admin buttons based on user authentication
	let adminButtons
	if(role==='admin'){
		adminButtons = (
			<>
				<TableDataCell style={{ textAlign: 'center' }}>
					<Link to={`/users/edit/${user._id}`}>
						<Button variant='flat' size='sm' onClick={() => updateUserState(user.username)}>
							<p style={{marginBottom: '0.2rem', fontSize: '1.25rem'}}>&#9998;</p>
						</Button>
					</Link>
				</TableDataCell>
				<TableDataCell style={{ textAlign: 'center' }}>
					<Button variant='flat' size='sm' onClick={() => deleteUserConfirm(user)}>
						<p style={{marginBottom: '0.2rem', fontSize: '1.25rem'}}>&#10008;</p>
					</Button>
				</TableDataCell>
			</>
		)
	}

	// Rendering user card
	return (
		<TableRow>
			{/* Setting width very large to force end columns to the right */}
			<TableDataCell style={{width: '1440px'}}>
				<div style={{whiteSpace: 'break-spaces'}}>{user.username}</div>
			</TableDataCell>
			{viewButton}
			{adminButtons}
		</TableRow>
	);
};

export default UserCard;
