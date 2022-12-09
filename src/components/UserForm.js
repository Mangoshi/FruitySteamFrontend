import {
	Anchor,
	Button,
	Frame,
	GroupBox, Select,
	TextInput,
	Window,
	WindowContent,
	WindowHeader
} from 'react95';
import {Link, useNavigate} from "react-router-dom";

import {useContext, useState} from "react";
import axios from "axios";
import {AuthContext} from "../AuthContext";
import ResponsiveWrapper from "./ResponsiveWrapper";

const UserForm = ({user, setUser}) => {

	const halfSizeGroupParent = {
		display: "flex",
		justifyContent: 'space-between'
	}

	const halfSizeGroupLeft = {
		marginBottom: '1rem',
		marginRight: '0.5rem',
		width: '100%'
	}

	const halfSizeGroupRight = {
		marginBottom: '1rem',
		marginLeft: '0.5rem',
		width: '100%'
	}

	const {token} = useContext(AuthContext)
	const navigate = useNavigate();

	const [form, setForm] = useState({
		username: '',
		email: '',
		password: '',
		role: 'basic',
		wishlist: [],
	})

	const [errors, setErrors] = useState({
		username: '',
		email: '',
		password: '',
		role: '',
		wishlist: [],
	})

	const handleForm = (e) => {
		console.log(e)
		let name, value
		if(e.target){
			name = e.target.name
			value = e.target.value
		} else {
			name = e.name
			value = e.value
		}
		if(!user){
			setForm(prevState => ({
				...prevState,
				[name]: value
			}));
		} else {
			setUser(prevState => ({
				...prevState,
				[name]: value
			}));
		}
	}

	const isRequired = (fields) => {
		let error = false;

		fields.forEach(field => {
			if(!form[field]){
				error = true;
				setErrors(prevState => ({
					...prevState,
					[field]: {
						message: `${field} is required!`
					}
				}));
			} else {
				setErrors(prevState => ({
					...prevState,
					[field]: {
						message: ''
					}
				}));
			}
		});

		return error;
	}

	const submitForm = () => {
		if(!user){
			if(!isRequired(['username', 'email', 'password'])){
				axios.post('https://fruity-steam.vercel.app/register', form, {
					headers: {
						"Authorization": `Bearer ${token}`
					}})
					.then(response => {
						console.log(response.data);
						navigate('/users');
					})
					.catch(err => {
						console.error(err);
						console.log(err.response.data.msg)
						setErrors(err.response.data.error);
					});
			}
		} else {
			// TODO: Figure out why isRequired is not working here
			axios.put(`https://fruity-steam.vercel.app/api/users/id/${user._id}`, user, {
				headers: {
					"Authorization": `Bearer ${token}`
				}})
				.then(response => {
					console.log(response.data);
					navigate('/users');
				})
				.catch(err => {
					console.error(err);
					console.log(err.response.data.msg)
					setErrors(err.response.data.error);
				});
		}
	}

	let formattedWishlist
	if(user && user.wishlist.length !== 0){
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

	// If no user props, it's an add form
	return (
		<div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
			<ResponsiveWrapper>
				<Window style={{width: '100%'}}>
					<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
						<span style={{marginLeft: '0.2rem'}}>{user ? 'Edit' : 'Add'} User.exe</span>
						<Link to='/users/'>
							<Button style={{marginTop: '0.2rem'}}>X</Button>
						</Link>
					</WindowHeader>
					<WindowContent>
						<Frame variant='inside' style={{margin: '1rem', padding: '1rem', width: '94%'}}>
							<GroupBox label={'Username'} style={{marginBottom: '1rem'}}>
								<TextInput
									name='username'
									value={user ? user.username : form.username}
									onChange={e => handleForm(e)}
									error={errors.username}
								/>
							</GroupBox>
							<GroupBox label={'Email'} style={{marginBottom: '1rem'}}>
								<TextInput
									name='email'
									value={user ? user.email : form.email}
									onChange={e => handleForm(e)}
									error={errors.email}
								/>
							</GroupBox>
							{ !user && (
								<GroupBox label={'Password'} style={{marginBottom: '1rem'}}>
									<TextInput
										name='password'
										value={form.password}
										onChange={e => handleForm(e)}
										error={errors.password}
									/>
								</GroupBox>
							)}
							<GroupBox label={'Role'} style={{marginBottom: '1rem'}}>
								<Select
									name='role'
									onChange={e => handleForm(e)}
									error={errors.role}
									options={[
										{value: 'basic', label: 'Basic'},
										{value: 'admin', label: 'Admin'},
									]}
									value={user ? user.role : form.role}
									defaultValue={user ? user.role : form.role}
								/>
							</GroupBox>
							{ user && (
								<GroupBox label='Wishlist' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{formattedWishlist ?
										<ol>
											{formattedWishlist}
										</ol>
										: 'No games in wishlist'}
								</span>
								</GroupBox>
							)}
							<div style={{display: 'flex', justifyContent:'space-evenly'}}>
								<Link to={'/users'}><Button>CANCEL</Button></Link>
								<Button onClick={submitForm}>SUBMIT</Button>
							</div>
						</Frame>
					</WindowContent>
				</Window>
			</ResponsiveWrapper>
		</div>
	)

}

export default UserForm;
