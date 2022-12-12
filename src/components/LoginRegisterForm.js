// UI imports
import {Anchor, Button, GroupBox, TextInput} from "react95";

// State imports
import { useState } from 'react';
import {useAuth} from "../useAuth";


const LoginRegisterForm = () => {

	// Importing login & register from useAuth
	const { login, register } = useAuth()

	// Initialising error message state
	const [usernameError, setUsernameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	// Initialising form type to switch form conditionally
	const [formType, setFormType] = useState("login")

	// Defining error message CSS style
	const errorStyle = {
		color: "red",
		backgroundColor:"white",
		borderRadius: 10,
		padding: 5,
		display: 'flex',
		justifyContent: 'center',
		marginTop: '0.5rem'
	};

	// Initialising form state as an empty form
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: ""
	});

	// Ensuring that typing in the form sets state in realtime
	const handleForm = (e) => {
		let name = e.target.name;
		let value = e.target.value;

		setForm(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	// Handling form validation
	const formRulesPassed = (form) => {
		let name = form.username;
		let email = form.email;
		let password = form.password;

		// Name must be alphanumeric
		let nameRule = /^[a-zA-Z0-9]+$/
		// Email must be alphanumeric with an @ symbol and a . symbol
		let emailRule = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
		// Password must be at least 5 characters long
		let passwordRule = password.length >= 5

		// Initialising rules passed state
		let nameRulePassed = false
		let emailRulePassed = false
		let passwordRulePassed = false

		// Testing name rule on name
		if(!nameRule.test(name)){
			setUsernameError("Username must be alphanumeric!")
		} else {
			setUsernameError("")
			nameRulePassed = true
		}

		// Testing email rule on email
		if (!emailRule.test(email)) {
			setEmailError("Email must be in the correct format!")
		} else {
			setEmailError("")
			emailRulePassed = true
		}

		// Testing password rule on password
		if (!passwordRule) {
			setPasswordError("Password must be at least 5 characters long!")
		} else {
			setPasswordError("")
			passwordRulePassed = true
		}

		// Returning true if all rules passed
		if(formType === 'login' && emailRulePassed && passwordRulePassed){
			return true
		}
		else if (formType === 'register' && nameRulePassed && emailRulePassed && passwordRulePassed){
			return true
		}
	}

	// Login function from useAuth
	const submitLoginRequest = () => {
		if(formRulesPassed(form)){
			login({
				email: form.email,
				password: form.password
			})
		}
	};

	// Register function from useAuth
	const submitRegisterRequest = () => {
		if(formRulesPassed(form)){
			register({
				username: form.username,
				email: form.email,
				password: form.password
			})
		}
	};

	// If/else to decide how the form is rendered, based on formType
	let formElements
	if(formType === 'login'){
		formElements = (
			<>
				<GroupBox label='Email'>
					<TextInput type="text" name="email" value={form.email} onChange={handleForm} />
					{emailError && <p style={errorStyle}>{emailError}</p>}
				</GroupBox>
				<br/>
				<GroupBox label='Password' style={{marginBottom: '1rem'}}>
					<TextInput type="password" name="password" value={form.password} onChange={handleForm} />
					{passwordError && <p style={errorStyle}>{passwordError}</p>}
				</GroupBox>
				<Anchor
					style={{cursor: 'pointer'}}
					onClick={() =>
						setFormType('register')
						& setPasswordError('')
						& setEmailError('')
						& setUsernameError('')}
				>
					Don't have an account?
				</Anchor>
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
					{usernameError && <p style={errorStyle}>{usernameError}</p>}
				</GroupBox>
				<br/>
				<GroupBox label='Email'>
					<TextInput type="text" name="email" value={form.email} onChange={handleForm} />
					{emailError && <p style={errorStyle}>{emailError}</p>}
				</GroupBox>
				<br/>
				<GroupBox label='Password' style={{marginBottom: '1rem'}}>
					<TextInput type="password" name="password" value={form.password} onChange={handleForm} />
					{passwordError && <p style={errorStyle}>{passwordError}</p>}
				</GroupBox>
				<Anchor
					style={{cursor: 'pointer'}}
					onClick={() =>
						setFormType('login')
						& setPasswordError('')
						& setEmailError('')
						& setUsernameError('')}
				>
					Back to login
				</Anchor>
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
		</>
	);
};

export default LoginRegisterForm;
