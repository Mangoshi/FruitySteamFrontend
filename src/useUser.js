import { UserContext } from "./UserContext";
import { useContext } from 'react'

// Initialising useUser
export const useUser = () => {
	// Using setUser from UserContext
	const { setUser } = useContext(UserContext)

	// Defining function to update user state
	const updateUserState = (user) => {
		console.log('updateUser: ', user)
		// Set user to data passed
		setUser(user)
	}

	return {
		updateUserState,
	}
}
