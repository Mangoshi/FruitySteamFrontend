// UI imports
import {Button, Frame, GroupBox, Select, TextInput, Window, WindowContent, WindowHeader} from 'react95';
import ResponsiveWrapper from "./ResponsiveWrapper";

// React Router imports
import {Link, useNavigate} from "react-router-dom";

// HTTP request imports
import axios from "axios";

// State imports
import {useContext, useState} from "react";
import {AuthContext} from "../AuthContext";
import {useUser} from "../useUser";

const UserForm = ({user, setUser}) => {

	// Using token and role from AuthContext to check user permissions
	const {token, role} = useContext(AuthContext)

	// Using navigate to handle redirects
	const navigate = useNavigate();

	// Using updateUserState from useUser hook to update user state
	const { updateUserState } = useUser()
	// If a user prop was passed in, set user state to that user
	if(user){
		updateUserState(user.username)
	}

	// Initialising state for form inputs
	const [form, setForm] = useState({
		username: '',
		email: '',
		password: '',
		role: 'basic',
		wishlist: [],
	})

	// Initialising state for form error messages
	const [errors, setErrors] = useState({
		username: '',
		email: '',
		password: '',
		role: '',
		wishlist: [],
	})

	// Wishlist state, if user prop was passed in set wishlist state to that user's wishlist
	const [wishlist, setWishlist] = useState(user ? user.wishlist : [])

	// Function to handle form input changes
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

	// Initialising state for HTTP request errors
	const [error , setError] = useState(null);

	// Function to handle required fields
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

	// Function to handle form submission
	const submitForm = () => {
		// If no user prop was passed in, create a new user
		if(!user){
			if(!isRequired(['username', 'email', 'password'])){
				axios.post('https://fruity-steam.vercel.app/register', form, {
					headers: {
						"Authorization": `Bearer ${token}`
					}})
					.then(response => {
						console.log(response.data);
						navigate(-1);
					})
					.catch(err => {
						console.error(err);
						console.log(err.response.data.message)
						setError(err.response.data.message);
					});
			}
		// If user prop was passed in, update the user
		} else {
			// TODO: Figure out why isRequired is not working here
			user.wishlist = wishlist
			axios.put(`https://fruity-steam.vercel.app/api/users/id/${user._id}`, user, {
				headers: {
					"Authorization": `Bearer ${token}`
				}})
				.then(response => {
					console.log(response.data);
					navigate(-1);
				})
				.catch(err => {
					console.error(err);
					console.log(err.response.data.message)
					setError(err.response.data.message);
				});
		}
	}

	// Function to handle removing items from wishlist
	function removeFromWishlist(gameID) {
		let newWishlist = wishlist.filter(entry => entry._id !== gameID)
		setWishlist(newWishlist)
	}

	// Function to format the wishlist for rendering
	function formatWishlist(wishlist) {
		if(user && wishlist){
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

	// Render the form
	return (
		<div style={{display: "flex", justifyContent: 'center', marginBottom: '1rem'}}>
			<ResponsiveWrapper>
				<Window style={{width: '100%'}}>
					<WindowHeader style={{display: "flex", justifyContent: 'space-between'}}>
						{ role === 'admin' ?
							<span style={{marginLeft: '0.2rem'}}>{user ? 'Edit' : 'Add'} User.exe</span>
							:
							<span style={{marginLeft: '0.2rem'}}>Edit Profile.exe</span>
						}
						<Button style={{marginTop: '0.2rem'}} onClick={() => navigate(-1)}>X</Button>
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
								{errors.username.message &&
									<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors.username.message}
										</small>
									</div>
								}
							</GroupBox>
							<GroupBox label={'Email'} style={{marginBottom: '1rem'}}>
								<TextInput
									name='email'
									value={user ? user.email : form.email}
									onChange={e => handleForm(e)}
									error={errors.email}
								/>
								{errors.email.message &&
									<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
										<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
											{errors.email.message}
										</small>
									</div>
								}
							</GroupBox>
							{ !user && (
								<GroupBox label={'Password'} style={{marginBottom: '1rem'}}>
									<TextInput
										name='password'
										value={form.password}
										onChange={e => handleForm(e)}
										error={errors.password}
									/>
									{errors.password.message &&
										<div style={{marginTop: '0.7rem', display: 'flex', justifyContent: 'center'}}>
											<small style={{color: 'red', backgroundColor: '#666', paddingLeft: 3, paddingRight: 3}}>
												{errors.password.message}
											</small>
										</div>
									}
								</GroupBox>
							)}
							{ role === 'admin' && (
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
							)}
							{ user && (
								<GroupBox label='Wishlist' style={{marginBottom: '1rem'}}>
								<span style={{fontSize: '1.2rem'}}>
									{formatWishlist(wishlist) ?
										<ol>
											{formatWishlist(wishlist)}
										</ol>
										: 'No games in wishlist'}
								</span>
								</GroupBox>
							)}
							{error &&
								<div style={{display: 'flex', justifyContent:'center', marginBottom: '1rem'}}>
									<p style={{color: 'red', backgroundColor: '#666', padding: 5}}>{error}</p>
								</div>
							}
							<div style={{display: 'flex', justifyContent:'space-evenly'}}>
								<Button onClick={() => navigate(-1)}>CANCEL</Button>
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
