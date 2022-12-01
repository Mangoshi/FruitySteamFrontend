import useToken from "./useToken";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";

// useAuth will define authentication functions to be used across the app
export const useAuth = () => {
	// Import token functions from useToken
	const { token, storeToken, removeToken } = useToken();
	// Import navigate function from React Router's useNavigate
	const navigate = useNavigate()

	useEffect(()=>{
		// Retrieve token from local storage
		const token = localStorage.getItem('token')
		// If token exists
		if(token) {
			// Store the token using function from useToken
			storeToken(token)
		}
		else {
			// console.log("No token in localStorage!")
		}
	},[storeToken])

	// Register function to register a new user using Axios to make HTTP request
	// - Running login HTTP request once registration occurs since only login returns token
	const register = ({username, email, password}) => {
		console.log("username:",username)
		console.log("email:",email)
		axios
			.post('https://fruity-steam.vercel.app/register', {username, email, password})
			.then((res)=> {
				console.log(res.data)
				axios
					.post('https://fruity-steam.vercel.app/login', {email, password})
					.then((res)=> {
						console.log(res.data)
						storeToken(res.data.token)
					})
					.catch((err) => {
						console.error('Error: ', err)
					})
			})
			.catch((err) => {
				console.error('Error: ', err)
			})
	}

	// Login function to log a user in using Axios to make HTTP request
	const login = ({email, password}) => {
		console.log("email:",email)
		axios
			.post('https://fruity-steam.vercel.app/login', {email, password})
			.then((res)=> {
				console.log(res.data)
				storeToken(res.data.token)
			})
			.catch((err) => {
				console.error('Error: ', err)
			})
	}

	// Logout function to remove token from state and navigate back home
	const logout = () => {
		removeToken()
		navigate('/')
	}

	return { token, register, login, logout }
}
