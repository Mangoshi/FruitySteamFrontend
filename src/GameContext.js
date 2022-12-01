import { createContext } from 'react';

// Initialise global game context
export const GameContext = createContext({
    // game starts as null
    game: null,
    // setGame allows game state to be updated
    setGame: () => {}
});
