import {createContext} from "react";

// Initialise global authentication context
export const AuthContext = createContext({
	// token starts as null
	token: null,
	// setToken allows token state to be updated
	setToken: () => {},
	// role starts as null
	role: null,
	// setRole allows role state to be updated
	setRole: () => {}
});
