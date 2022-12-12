// UserForm import
import UserForm from "../../components/UserForm";

// UI imports
import {Button, Hourglass, Window, WindowContent, WindowHeader} from "react95";

// React Router imports
import {Link, useParams} from "react-router-dom";

// HTTP request imports
import axios from "axios";

// State imports
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../AuthContext";

const Edit = ({me}) => {

	// ID from URL params
	const { id } = useParams();
	// User state
	const [ user, setUser ] = useState(null);
	// Token from AuthContext
	const { token } = useContext(AuthContext)

	// GET request to get user data using id from URL params
	// If me prop wasn't passed, make request to get user data using id from URL params
	// Else, make request to get user data using id from me prop
	useEffect(() => {
		if(!me){
			axios.get(`https://fruity-steam.vercel.app/api/users/?by=_id&query=${id}`,
				{
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.then((response) => {
					console.log(response.data.data[0]);
					setUser(response.data.data[0])
				})
				.catch((err) => {
					console.error(err);
					console.log(err.response.data.message);
				});
		} else {
			axios.get(`https://fruity-steam.vercel.app/api/users/id/${me}`,
				{
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.then((response) => {
					console.log(response.data.data[0]);
					setUser(response.data.data[0])
				})
				.catch((err) => {
					console.error(err);
					console.log(err.response.data.message);
				});
		}
	}, [id]);

	// If user state is null, return window with loading animation
	if(!user) return (
		<div style={{display: "flex", justifyContent: 'center'}}>
			<Window style={{width: "250px"}}>
				<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
					<span style={{marginLeft: '0.2rem'}}>Edit.exe</span>
					<Link to='/games/'>
						<Button style={{marginTop: '0.2rem'}}>X</Button>
					</Link>
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

	// Else, return UserForm component with user data
	return (
		<>
			<UserForm user={user} setUser={setUser} key={user.id}/>
		</>
	);
};

export default Edit;
