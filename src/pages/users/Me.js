// UserCardDetailed import
import UserCardDetailed from "../../components/UserCardDetailed";

// UI import
import {Button, Hourglass, Window, WindowContent, WindowHeader} from "react95";

// React Router import
import {useNavigate} from "react-router-dom";

// HTTP request import
import axios from "axios";

// State import
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../AuthContext";

const Me = () => {
	// Token and ID from AuthContext
	const { token, id } = useContext(AuthContext)
	// User state
	const [ user, setUser ] = useState(null);
	// Navigate function from React Router
	const navigate = useNavigate();

	// GET request to get user data using id from AuthContext (current user)
	useEffect(() => {
		axios.get(`https://fruity-steam.vercel.app/api/users/id/${id}`,
			{
				headers: {
					"Authorization": `Bearer ${token}`
				}
			})
			.then((response) => {
				console.log(response.data);
				setUser(response.data.data[0])
			})
			.catch((err) => {
				console.error(err);
				console.log(err.response.data.message);
			});
	}, [id, token]);

	// If user state is null, return loading animation
	if(!user) return (
		<div style={{display: "flex", justifyContent: 'center'}}>
			<Window style={{width: "250px"}}>
				<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
					<span style={{marginLeft: '0.2rem'}}>Me.exe</span>
					<Button style={{marginTop: '0.2rem'}} onClick={() => navigate(-1)}>X</Button>
				</WindowHeader>
				<WindowContent>
					<div style={{display: "flex", flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}>
						<p style={{fontSize: '1.5rem'}}>Loading...</p>
						<Hourglass size={48} style={{ margin: 20 }}/>
					</div>
				</WindowContent>
			</Window>
		</div>
	)

	// Else, return user card with user data
	return (
		<>
			<UserCardDetailed user={user} key={user.id} />
		</>
	);
}

export default Me;
