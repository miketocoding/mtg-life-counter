import { afterEach, describe, expect, it, vi } from 'vitest'
import { initialState } from './gameReducer'
import { loadState, saveState } from './storage'

// Tests run in Node, which has no localStorage.
function stubStorage(contents: Record<string, string> = {}) {
  const store = new Map(Object.entries(contents))
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadState', () => {
  it('starts fresh when nothing is saved', () => {
    stubStorage()
    expect(loadState()).toBe(initialState)
  })

  it('restores a saved game', () => {
    stubStorage()
    const saved = { ...initialState, screen: 'game' as const, keepAwake: false }
    saveState(saved)
    expect(loadState()).toEqual(saved)
  })

  it('keeps a game saved before the keep-awake setting, with it on', () => {
    stubStorage({
      'mtg-life-counter:v1': JSON.stringify({
        screen: 'game',
        playerCount: 2,
        startingLife: 20,
        sideSeat: 'left',
        life: [14, 9],
      }),
    })
    expect(loadState()).toMatchObject({ life: [14, 9], keepAwake: true })
  })
})
