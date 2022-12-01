import {createContext} from "react";

// Initialise global authentication context
export const AuthContext = createContext({
	// token starts as null
	token: null,
	// setToken allows token state to be updated
	setToken: () => {}
});
