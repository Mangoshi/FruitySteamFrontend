import { Link } from 'react-router-dom';
import { Button, TableDataCell, TableRow } from 'react95';
import { useUser } from "../useUser";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const UserCard = ({user, users, setUsers}) => {
	// importing token context to check if logged-in
	const { token, role } = useContext(AuthContext)
	// importing updateUserState function from useUser
	const { updateUserState } = useUser()

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

	const deleteUserConfirm = (user) => {
		let result = window.confirm(`Are you sure you want to delete ${user.username}?`);
		if (result) {
			deleteUser(user._id);
		}
	}

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
