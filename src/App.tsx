import { useEffect, useReducer } from 'react'
import { GameScreen } from './components/GameScreen'
import { SetupScreen } from './components/SetupScreen'
import { useWakeLock } from './hooks/useWakeLock'
import { gameReducer } from './state/gameReducer'
import { loadState, saveState } from './state/storage'

function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadState)

  useEffect(() => saveState(state), [state])
  useWakeLock(state.screen === 'game')

  return state.screen === 'setup' ? (
    <SetupScreen state={state} dispatch={dispatch} />
  ) : (
    <GameScreen state={state} dispatch={dispatch} />
  )
}

export default App
