import useToken from "./useToken";
import useRole from "./useRole";
import useID from "./useID";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";

// useAuth defines authentication functions to be used across the app as a hook
export const useAuth = () => {
	// Import token functions from useToken
	const { token, storeToken, removeToken } = useToken();
	// Import role functions from useRole
	const { role, storeRole, removeRole } = useRole();
	// Import id functions from useID
	const { id, storeID, removeID } = useID();
	// Import navigate function from React Router's useNavigate
	const navigate = useNavigate()

	useEffect(()=>{
		// Retrieve token from local storage
		const token = localStorage.getItem('token')
		// Retrieve role from local storage
		const role = localStorage.getItem('role')
		// Retrieve id from local storage
		const id = localStorage.getItem('userID')
		// If token exists
		if(token) {
			// Store the token using function from useToken
			storeToken(token)
		} else {
			// console.log("No token in localStorage!")
		}
		// If role exists
		if(role) {
			// Store the role using function from useRole
			storeRole(role)
		} else {
			// console.log("No role in localStorage!")
		}
		// If id exists
		if(id) {
			// Store the id using function from useID
			storeID(id)
		} else {
			// console.log("No id in localStorage!")
		}
	},[storeRole, storeToken, storeID])

	// Login function to log a user in using Axios to make HTTP request
	const login = ({email, password}) => {
		// console.log("email:",email)
		axios
			.post('https://fruity-steam.vercel.app/login', {email, password})
			.then((res)=> {
				// console.log(res.data)
				storeToken(res.data.token)
				storeRole(res.data.role)
				storeID(res.data.id)
			})
			.catch((err) => {
				console.error('Error: ', err)
			})
	}

	// Register function to register a new user using Axios to make HTTP request
	// - Running login HTTP request once registration occurs since only login returns token
	const register = ({username, email, password}) => {
		// console.log("username:",username)
		// console.log("email:",email)
		axios
			.post('https://fruity-steam.vercel.app/register', {username, email, password})
			.then((res)=> {
				console.log(res.data)
				axios
					.post('https://fruity-steam.vercel.app/login', {email, password})
					.then((res)=> {
						// console.log(res.data)
						storeToken(res.data.token)
						storeRole(res.data.role)
						storeID(res.data.id)
					})
					.catch((err) => {
						console.error('Error: ', err)
					})
			})
			.catch((err) => {
				console.error('Error: ', err)
			})
	}

	// Logout function to remove token from state and navigate back home
	const logout = () => {
		removeToken()
		removeRole()
		removeID()
		navigate('/')
	}

	return { token, id, register, login, logout }
}
