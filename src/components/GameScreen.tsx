import type { Dispatch } from 'react'
import type {
  GameAction,
  GameState,
  PlayerCount,
} from '../state/gameReducer'
import { Menu } from './Menu'
import { PlayerPanel, type Orientation } from './PlayerPanel'

// Panels are laid out top to bottom, left to right.
function orientations(state: GameState): Orientation[] {
  switch (state.playerCount) {
    case 1:
      return ['upright']
    case 2:
      return ['flipped', 'upright']
    case 3:
      return ['flipped', `side-${state.sideSeat}`, 'upright']
    case 4:
      return ['flipped', 'flipped', 'upright', 'upright']
  }
}

// The phone's owner holds it from the bottom edge, so their seat is the
// upright panel at the bottom (bottom-left with four players).
const OWNER_SEAT: Record<PlayerCount, number> = { 1: 0, 2: 1, 3: 2, 4: 2 }

// Colour number for each panel: the owner always gets colour 1, and the
// other seats take the rest in panel order.
function colours(playerCount: PlayerCount): number[] {
  const owner = OWNER_SEAT[playerCount]
  const result: number[] = []
  let next = 2
  for (let seat = 0; seat < playerCount; seat++) {
    result.push(seat === owner ? 1 : next++)
  }
  return result
}

interface GameScreenProps {
  state: GameState
  dispatch: Dispatch<GameAction>
}

export function GameScreen({ state, dispatch }: GameScreenProps) {
  const layout = orientations(state)
  const panelColours = colours(state.playerCount)

  return (
    <main className={`game game--${state.playerCount}`}>
      {state.life.map((life, player) => (
        <PlayerPanel
          key={player}
          player={player}
          life={life}
          orientation={layout[player]}
          colour={panelColours[player]}
          onChange={(amount) =>
            dispatch({ type: 'CHANGE_LIFE', player, amount })
          }
        />
      ))}
      <Menu
        startingLife={state.startingLife}
        sideSeat={state.playerCount === 3 ? state.sideSeat : undefined}
        keepAwake={state.keepAwake}
        onKeepAwakeChange={(keepAwake) =>
          dispatch({ type: 'SET_KEEP_AWAKE', keepAwake })
        }
        onReset={() => dispatch({ type: 'RESET' })}
        onNewGame={() => dispatch({ type: 'NEW_GAME' })}
        onSideSeatChange={(sideSeat) =>
          dispatch({ type: 'SET_SIDE_SEAT', sideSeat })
        }
      />
    </main>
  )
}
