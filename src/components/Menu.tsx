import { useState } from 'react'
import type { SideSeat } from '../state/gameReducer'

type View = 'closed' | 'menu' | 'confirm-reset' | 'confirm-new-game'

interface MenuProps {
  startingLife: number
  // Present only in 3-player games, where one player sits at the side.
  sideSeat?: SideSeat
  keepAwake: boolean
  onKeepAwakeChange: (keepAwake: boolean) => void
  onReset: () => void
  onNewGame: () => void
  onSideSeatChange: (sideSeat: SideSeat) => void
}

export function Menu({
  startingLife,
  sideSeat,
  keepAwake,
  onKeepAwakeChange,
  onReset,
  onNewGame,
  onSideSeatChange,
}: MenuProps) {
  const [view, setView] = useState<View>('closed')
  const close = () => setView('closed')

  return (
    <>
      <button
        type="button"
        className="menu-button"
        aria-label="Open menu"
        onClick={() => setView('menu')}
      >
        <span className="menu-button__bars" aria-hidden="true" />
      </button>

      {view !== 'closed' && (
        <div className="overlay" onClick={close}>
          <div
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onClick={(event) => event.stopPropagation()}
          >
            {view === 'menu' && (
              <>
                <h2 className="dialog__title">Menu</h2>
                <button
                  type="button"
                  className="button"
                  onClick={() => setView('confirm-reset')}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => setView('confirm-new-game')}
                >
                  New Game
                </button>
                {sideSeat && (
                  <button
                    type="button"
                    className="button"
                    onClick={() => {
                      onSideSeatChange(sideSeat === 'left' ? 'right' : 'left')
                      close()
                    }}
                  >
                    Move side player to {sideSeat === 'left' ? 'right' : 'left'}{' '}
                    edge
                  </button>
                )}
                <button
                  type="button"
                  role="switch"
                  aria-checked={keepAwake}
                  className="setting"
                  onClick={() => onKeepAwakeChange(!keepAwake)}
                >
                  <span className="setting__text">
                    <span className="setting__label">Keep screen awake</span>
                    <span className="setting__note">
                      {keepAwake
                        ? 'Sleeps after 5 min untouched'
                        : "Uses your phone's sleep setting"}
                    </span>
                  </span>
                  <span className="switch" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="button button--quiet"
                  onClick={close}
                >
                  Close
                </button>
              </>
            )}

            {view === 'confirm-reset' && (
              <>
                <p className="dialog__text">
                  Reset every player to {startingLife} life?
                </p>
                <button
                  type="button"
                  className="button button--danger"
                  onClick={() => {
                    onReset()
                    close()
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="button button--quiet"
                  onClick={() => setView('menu')}
                >
                  Cancel
                </button>
              </>
            )}

            {view === 'confirm-new-game' && (
              <>
                <p className="dialog__text">
                  End this game and go back to setup?
                </p>
                <button
                  type="button"
                  className="button button--danger"
                  onClick={onNewGame}
                >
                  New Game
                </button>
                <button
                  type="button"
                  className="button button--quiet"
                  onClick={() => setView('menu')}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
