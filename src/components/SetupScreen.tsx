import { useState, type Dispatch } from 'react'
import {
  isValidStartingLife,
  LIFE_PRESETS,
  MAX_STARTING_LIFE,
  MIN_STARTING_LIFE,
  PLAYER_COUNTS,
  type GameAction,
  type GameState,
  type PlayerCount,
} from '../state/gameReducer'

interface SetupScreenProps {
  state: GameState
  dispatch: Dispatch<GameAction>
}

export function SetupScreen({ state, dispatch }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState<PlayerCount>(state.playerCount)
  const [lifeInput, setLifeInput] = useState(String(state.startingLife))

  const startingLife = /^\d+$/.test(lifeInput) ? Number(lifeInput) : Number.NaN
  const valid = isValidStartingLife(startingLife)

  return (
    <main className="setup">
      <form
        className="setup__form"
        onSubmit={(event) => {
          event.preventDefault()
          if (valid) dispatch({ type: 'START_GAME', playerCount, startingLife })
        }}
      >
        <div className="pips" aria-hidden="true">
          {['w', 'u', 'b', 'r', 'g'].map((mana) => (
            <span key={mana} className={`pips__pip pips__pip--${mana}`} />
          ))}
        </div>
        <h1 className="setup__title">Life Counter</h1>

        <fieldset className="field">
          <legend className="field__label">Players</legend>
          <div className="choices">
            {PLAYER_COUNTS.map((count) => (
              <button
                key={count}
                type="button"
                className="choice choice--players"
                aria-pressed={count === playerCount}
                onClick={() => setPlayerCount(count)}
              >
                {count}
                <span className="seats" aria-hidden="true">
                  {Array.from({ length: count }, (_, seat) => (
                    <span
                      key={seat}
                      className={`seats__dot seats__dot--colour-${seat + 1}`}
                    />
                  ))}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {playerCount === 3 && (
          <fieldset className="field">
            <legend className="field__label">Side player sits on the</legend>
            <div className="choices">
              {(['left', 'right'] as const).map((seat) => (
                <button
                  key={seat}
                  type="button"
                  className="choice choice--text"
                  aria-pressed={seat === state.sideSeat}
                  onClick={() =>
                    dispatch({ type: 'SET_SIDE_SEAT', sideSeat: seat })
                  }
                >
                  {seat === 'left' ? 'Left edge' : 'Right edge'}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset className="field">
          <legend className="field__label">Starting life</legend>
          <div className="choices">
            {LIFE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className="choice"
                aria-pressed={preset === startingLife}
                onClick={() => setLifeInput(String(preset))}
              >
                {preset}
              </button>
            ))}
          </div>
          <label className="custom">
            <span className="custom__label">Custom</span>
            <input
              className="custom__input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={3}
              value={lifeInput}
              aria-invalid={!valid}
              onChange={(event) => setLifeInput(event.target.value.trim())}
            />
          </label>
          {!valid && (
            <p className="field__error" role="alert">
              Enter a whole number from {MIN_STARTING_LIFE} to{' '}
              {MAX_STARTING_LIFE}.
            </p>
          )}
        </fieldset>

        <button type="submit" className="button button--primary" disabled={!valid}>
          Start
        </button>
      </form>
    </main>
  )
}
