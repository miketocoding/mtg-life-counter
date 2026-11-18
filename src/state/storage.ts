import {
  initialState,
  isValidStartingLife,
  PLAYER_COUNTS,
  type GameState,
} from './gameReducer'

const STORAGE_KEY = 'mtg-life-counter:v1'

function isGameState(value: unknown): value is GameState {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    (v.screen === 'setup' || v.screen === 'game') &&
    PLAYER_COUNTS.includes(v.playerCount as GameState['playerCount']) &&
    typeof v.startingLife === 'number' &&
    isValidStartingLife(v.startingLife) &&
    (v.sideSeat === 'left' || v.sideSeat === 'right') &&
    Array.isArray(v.life) &&
    v.life.length === v.playerCount &&
    v.life.every((n) => Number.isInteger(n)) &&
    typeof v.keepAwake === 'boolean'
  )
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return initialState
    const parsed: unknown = JSON.parse(raw)
    // State saved before the keep-awake setting existed has it on.
    const withDefaults =
      typeof parsed === 'object' && parsed !== null
        ? { keepAwake: true, ...parsed }
        : parsed
    return isGameState(withDefaults) ? withDefaults : initialState
  } catch {
    return initialState
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be full or blocked (private mode); the game still works.
  }
}
