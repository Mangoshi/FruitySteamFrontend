import {useContext} from "react";
import {AuthContext} from "./AuthContext";

// useID will define ID functions, and allows us to update AuthContext state
const useID = () => {
	// Import setID function from AuthContext
	const {setID} = useContext(AuthContext)

	const storeID = userID => {
		// Save id to local storage
		localStorage.setItem('userID', userID)
		// Set AuthContext id
		setID(userID)
		// console.log("id set!")
	}

	const removeID = () => {
		// Remove token from local storage
		localStorage.removeItem('userID')
		// Unset AuthContext token
		setID('')
		// console.log("id removed!")
	}

	return {
		storeID, removeID
	}
}

export default useID
