import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../AuthContext";
import axios from "axios";
import {Button, Hourglass, Window, WindowContent, WindowHeader} from "react95";
import UserCardDetailed from "../../components/UserCardDetailed";
import {useNavigate} from "react-router-dom";

const Me = () => {
	const { token, id } = useContext(AuthContext)
	const [ user, setUser ] = useState(null);
	const navigate = useNavigate();

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

	return (
		<>
			<UserCardDetailed user={user} key={user.id} />
		</>
	);
}

export default Me;
