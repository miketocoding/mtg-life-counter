import type { Dispatch } from 'react'
import type { GameAction, GameState } from '../state/gameReducer'
import { Menu } from './Menu'
import { PlayerPanel, type Orientation } from './PlayerPanel'

// Panels are laid out top to bottom, left to right.
function orientations(state: GameState): Orientation[] {
  switch (state.playerCount) {
    case 2:
      return ['flipped', 'upright']
    case 3:
      return ['flipped', `side-${state.sideSeat}`, 'upright']
    case 4:
      return ['flipped', 'flipped', 'upright', 'upright']
  }
}

interface GameScreenProps {
  state: GameState
  dispatch: Dispatch<GameAction>
}

export function GameScreen({ state, dispatch }: GameScreenProps) {
  const layout = orientations(state)

  return (
    <main className={`game game--${state.playerCount}`}>
      {state.life.map((life, player) => (
        <PlayerPanel
          key={player}
          player={player}
          life={life}
          orientation={layout[player]}
          onChange={(amount) =>
            dispatch({ type: 'CHANGE_LIFE', player, amount })
          }
        />
      ))}
      <Menu
        startingLife={state.startingLife}
        sideSeat={state.playerCount === 3 ? state.sideSeat : undefined}
        onReset={() => dispatch({ type: 'RESET' })}
        onNewGame={() => dispatch({ type: 'NEW_GAME' })}
        onSideSeatChange={(sideSeat) =>
          dispatch({ type: 'SET_SIDE_SEAT', sideSeat })
        }
      />
    </main>
  )
}
