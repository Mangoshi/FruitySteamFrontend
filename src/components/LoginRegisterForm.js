import { useState } from 'react';
import {Anchor, Button, GroupBox, TextInput} from "react95";
import {useAuth} from "../useAuth";


const LoginRegisterForm = () => {

	// Importing login & register from useAuth
	const { login, register } = useAuth()

	// Initialising form state as an empty form
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: ""
	});

	// Initialising error message state
	// TODO: Get errors from stateful login/register functions
	const [errorMessage, setErrorMessage] = useState("");

	// Initialising form type to switch form conditionally
	const [formType, setFormType] = useState("login")

	// Defining error message CSS style
	const errorStyle = { color: "red", backgroundColor:"white" };

	// Ensuring that typing in the form sets state in realtime
	const handleForm = (e) => {
		let name = e.target.name;
		let value = e.target.value;

		setForm(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	// Login function from useAuth
	const submitLoginRequest = () => {
		// TODO: Form error messages!
		login({
				email: form.email,
				password: form.password
		})
	};

	// Register function from useAuth
	const submitRegisterRequest = () => {
		// TODO: Form error messages!
		register({
			username: form.username,
			email: form.email,
			password: form.password
		})
	};

	// If/else to decide how the form is rendered, based on formType
	let formElements
	if(formType === 'login'){
		formElements = (
			<>
				<GroupBox label='Email'>
					<TextInput type="text" name="email" value={form.email} onChange={handleForm} />
				</GroupBox>
				<br/>
				<GroupBox label='Password' style={{marginBottom: '1rem'}}>
					<TextInput type="password" name="password" value={form.password} onChange={handleForm} />
				</GroupBox>
				<Anchor style={{cursor: 'pointer'}} onClick={() => setFormType('register')}>Don't have an account?</Anchor>
				<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '1rem'}}>
					<Button onClick={submitLoginRequest}>Submit</Button>
				</div>
			</>
		)
	} else {
		formElements = (
			<>
				<GroupBox label='Username'>
					<TextInput type="text" name="username" value={form.username} onChange={handleForm} />
				</GroupBox>
				<br/>
				<GroupBox label='Email'>
					<TextInput type="text" name="email" value={form.email} onChange={handleForm} />
				</GroupBox>
				<br/>
				<GroupBox label='Password' style={{marginBottom: '1rem'}}>
					<TextInput type="password" name="password" value={form.password} onChange={handleForm} />
				</GroupBox>
				<Anchor style={{cursor: 'pointer'}} onClick={() => setFormType('login')}>Back to login</Anchor>
				<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '1rem'}}>
					<Button onClick={submitRegisterRequest}>Submit</Button>
				</div>
			</>
		)
	}

	// Return selected form & include errors below if they exist
	return (
		<>
			{formElements}
			<p style={errorStyle}>{errorMessage}</p>
		</>
	);
};

export default LoginRegisterForm;
