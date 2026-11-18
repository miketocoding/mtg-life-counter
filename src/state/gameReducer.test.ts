import { describe, expect, it } from 'vitest'
import { gameReducer, initialState, type GameState } from './gameReducer'

const inGame: GameState = {
  screen: 'game',
  playerCount: 4,
  startingLife: 40,
  sideSeat: 'left',
  life: [40, 40, 40, 40],
  keepAwake: true,
}

describe('gameReducer', () => {
  it('starts on the setup screen with 20 life', () => {
    expect(initialState.screen).toBe('setup')
    expect(initialState.startingLife).toBe(20)
  })

  describe('START_GAME', () => {
    it('gives every player the starting life and shows the game', () => {
      const state = gameReducer(initialState, {
        type: 'START_GAME',
        playerCount: 3,
        startingLife: 30,
      })
      expect(state).toMatchObject({
        screen: 'game',
        playerCount: 3,
        startingLife: 30,
        life: [30, 30, 30],
      })
    })

    it('starts a one-player game with a single life total', () => {
      const state = gameReducer(initialState, {
        type: 'START_GAME',
        playerCount: 1,
        startingLife: 40,
      })
      expect(state).toMatchObject({ screen: 'game', playerCount: 1, life: [40] })
    })

    it('keeps the side seat setting', () => {
      const state = gameReducer(
        { ...initialState, sideSeat: 'right' },
        { type: 'START_GAME', playerCount: 3, startingLife: 20 },
      )
      expect(state.sideSeat).toBe('right')
    })

    it.each([0, -5, 1000, 20.5, Number.NaN])(
      'ignores an invalid starting life of %s',
      (startingLife) => {
        const state = gameReducer(initialState, {
          type: 'START_GAME',
          playerCount: 2,
          startingLife,
        })
        expect(state).toBe(initialState)
      },
    )
  })

  describe('CHANGE_LIFE', () => {
    it('changes only the given player', () => {
      const state = gameReducer(inGame, {
        type: 'CHANGE_LIFE',
        player: 1,
        amount: -5,
      })
      expect(state.life).toEqual([40, 35, 40, 40])
    })

    it('adds life', () => {
      const state = gameReducer(inGame, {
        type: 'CHANGE_LIFE',
        player: 3,
        amount: 1,
      })
      expect(state.life).toEqual([40, 40, 40, 41])
    })

    it('lets life go below zero', () => {
      const state = gameReducer(
        { ...inGame, life: [2, 40, 40, 40] },
        { type: 'CHANGE_LIFE', player: 0, amount: -5 },
      )
      expect(state.life[0]).toBe(-3)
    })

    it('does not mutate the previous state', () => {
      gameReducer(inGame, { type: 'CHANGE_LIFE', player: 0, amount: -1 })
      expect(inGame.life).toEqual([40, 40, 40, 40])
    })

    it.each([-1, 4])('ignores an out-of-range player index %s', (player) => {
      const state = gameReducer(inGame, {
        type: 'CHANGE_LIFE',
        player,
        amount: 1,
      })
      expect(state).toBe(inGame)
    })

    it('is ignored on the setup screen', () => {
      const state = gameReducer(initialState, {
        type: 'CHANGE_LIFE',
        player: 0,
        amount: 1,
      })
      expect(state).toBe(initialState)
    })
  })

  describe('RESET', () => {
    it('restores starting life and keeps players and settings', () => {
      const state = gameReducer(
        { ...inGame, life: [12, -3, 40, 57] },
        { type: 'RESET' },
      )
      expect(state).toEqual(inGame)
    })
  })

  describe('NEW_GAME', () => {
    it('returns to setup and remembers the last settings', () => {
      const state = gameReducer(
        { ...inGame, life: [12, -3, 40, 57] },
        { type: 'NEW_GAME' },
      )
      expect(state).toMatchObject({
        screen: 'setup',
        playerCount: 4,
        startingLife: 40,
        life: [40, 40, 40, 40],
      })
    })
  })

  describe('SET_SIDE_SEAT', () => {
    it('switches the side player edge without touching life totals', () => {
      const before: GameState = {
        ...inGame,
        playerCount: 3,
        life: [18, 7, 22],
      }
      const state = gameReducer(before, {
        type: 'SET_SIDE_SEAT',
        sideSeat: 'right',
      })
      expect(state.sideSeat).toBe('right')
      expect(state.life).toEqual([18, 7, 22])
    })
  })

  describe('SET_KEEP_AWAKE', () => {
    it('turns the setting off without touching the game', () => {
      const state = gameReducer(inGame, {
        type: 'SET_KEEP_AWAKE',
        keepAwake: false,
      })
      expect(state).toEqual({ ...inGame, keepAwake: false })
    })
  })
})
