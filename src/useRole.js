import {useContext} from "react";
import {AuthContext} from "./AuthContext";

// useToken will define token functions, and allows us to update AuthContext state
const useToken = () => {
	// Import setToken function from AuthContext
	const {setRole} = useContext(AuthContext)

	const storeRole = userRole => {
		// Save role to local storage
		localStorage.setItem('role', userRole)
		// Set AuthContext role
		setRole(userRole)
		// console.log("role set!")
	}

	const removeRole = () => {
		// Remove token from local storage
		localStorage.removeItem('role')
		// Unset AuthContext token
		setRole('')
		// console.log("role removed!")
	}

	return {
		storeRole, removeRole
	}
}

export default useToken
