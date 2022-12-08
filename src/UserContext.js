import { createContext } from 'react';

// Initialise global user context
export const UserContext = createContext({
	// user starts as null
	user: null,
	// setUser allows user state to be updated
	setUser: () => {}
});
