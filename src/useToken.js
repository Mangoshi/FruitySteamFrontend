import {useContext} from "react";
import {AuthContext} from "./AuthContext";

// useToken will define token functions, and allows us to update AuthContext state
const useToken = () => {
	// Import setToken function from AuthContext
	const {setToken} = useContext(AuthContext)

	const storeToken = userToken => {
		// Save token to local storage
		localStorage.setItem('token', userToken)
		// Set AuthContext token
		setToken(userToken)
		// console.log("token set!")
	}

	const removeToken = () => {
		// Remove token from local storage
		localStorage.removeItem('token')
		// Unset AuthContext token
		setToken('')
		// console.log("token removed!")
	}

	return {
		storeToken, removeToken
	}
}

export default useToken
