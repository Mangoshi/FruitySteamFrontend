import { createContext } from 'react';

// Initialise GameContext
export const GameContext = createContext({
    // game starts as null
    game: null,
    // setGame allows game property to be updated
    setGame: () => {}
});
