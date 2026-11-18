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

  // Match the browser bar to the screen: the setup screen's light --bg,
  // or the game screen's dark one.
  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', state.screen === 'setup' ? '#f5ecd7' : '#111113')
  }, [state.screen])

  return state.screen === 'setup' ? (
    <SetupScreen state={state} dispatch={dispatch} />
  ) : (
    <GameScreen state={state} dispatch={dispatch} />
  )
}

export default App
