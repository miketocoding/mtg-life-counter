// 1 is for a player whose opponents track their own life elsewhere.
export type PlayerCount = 1 | 2 | 3 | 4
export type Screen = 'setup' | 'game'
// Which edge of the phone the third (sideways) player sits at in a 3-player game.
export type SideSeat = 'left' | 'right'

export interface GameState {
  screen: Screen
  playerCount: PlayerCount
  startingLife: number
  sideSeat: SideSeat
  life: number[]
  // Keep the screen awake during a game (see useWakeLock).
  keepAwake: boolean
}

export type GameAction =
  | { type: 'START_GAME'; playerCount: PlayerCount; startingLife: number }
  | { type: 'CHANGE_LIFE'; player: number; amount: number }
  | { type: 'RESET' }
  | { type: 'NEW_GAME' }
  | { type: 'SET_SIDE_SEAT'; sideSeat: SideSeat }
  | { type: 'SET_KEEP_AWAKE'; keepAwake: boolean }

export const PLAYER_COUNTS: readonly PlayerCount[] = [1, 2, 3, 4]
export const LIFE_PRESETS: readonly number[] = [20, 25, 30, 40]
export const DEFAULT_STARTING_LIFE = 20
export const MIN_STARTING_LIFE = 1
export const MAX_STARTING_LIFE = 999

export function isValidStartingLife(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= MIN_STARTING_LIFE &&
    value <= MAX_STARTING_LIFE
  )
}

function freshLife(playerCount: PlayerCount, startingLife: number): number[] {
  return Array.from({ length: playerCount }, () => startingLife)
}

export const initialState: GameState = {
  screen: 'setup',
  playerCount: 2,
  startingLife: DEFAULT_STARTING_LIFE,
  sideSeat: 'left',
  life: freshLife(2, DEFAULT_STARTING_LIFE),
  keepAwake: true,
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      if (!isValidStartingLife(action.startingLife)) return state
      return {
        ...state,
        screen: 'game',
        playerCount: action.playerCount,
        startingLife: action.startingLife,
        life: freshLife(action.playerCount, action.startingLife),
      }
    }
    case 'CHANGE_LIFE': {
      if (state.screen !== 'game') return state
      if (action.player < 0 || action.player >= state.life.length) return state
      return {
        ...state,
        life: state.life.map((value, index) =>
          index === action.player ? value + action.amount : value,
        ),
      }
    }
    case 'RESET':
      return {
        ...state,
        life: freshLife(state.playerCount, state.startingLife),
      }
    case 'NEW_GAME':
      return {
        ...state,
        screen: 'setup',
        life: freshLife(state.playerCount, state.startingLife),
      }
    case 'SET_SIDE_SEAT':
      return { ...state, sideSeat: action.sideSeat }
    case 'SET_KEEP_AWAKE':
      return { ...state, keepAwake: action.keepAwake }
  }
}
