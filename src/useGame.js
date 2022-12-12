import { GameContext } from "./GameContext";
import { useContext } from 'react'

// useGame defines game functions to be used across the app as a hook
export const useGame = () => {
    // Using setGame from GameContext
    const { setGame } = useContext(GameContext)

    // Defining function to update game state
    const updateGameState = (game) => {
        // console.log('updateGame: ', game)
        // Set game to data passed
        setGame(game)
    }

    return {
        updateGameState,
    }
}
