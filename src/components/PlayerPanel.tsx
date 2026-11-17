import { useEffect, useRef, useState } from 'react'
import { usePressAndHold } from '../hooks/usePressAndHold'

export type Orientation = 'upright' | 'flipped' | 'side-left' | 'side-right'

const TAP_AMOUNT = 1
const HOLD_AMOUNT = 5
const DELTA_FADE_MS = 2000

interface PlayerPanelProps {
  player: number
  life: number
  orientation: Orientation
  onChange: (amount: number) => void
}

function formatDelta(value: number): string {
  if (value > 0) return `+${value}`
  if (value < 0) return `−${-value}`
  return '0'
}

export function PlayerPanel({
  player,
  life,
  orientation,
  onChange,
}: PlayerPanelProps) {
  const [delta, setDelta] = useState({ value: 0, fading: true })
  const fadeTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(fadeTimer.current), [])

  const change = (amount: number) => {
    onChange(amount)
    // A change after the previous delta faded starts a new running total.
    setDelta((d) => ({ value: (d.fading ? 0 : d.value) + amount, fading: false }))
    window.clearTimeout(fadeTimer.current)
    fadeTimer.current = window.setTimeout(
      () => setDelta((d) => ({ ...d, fading: true })),
      DELTA_FADE_MS,
    )
  }

  const minus = usePressAndHold(
    () => change(-TAP_AMOUNT),
    () => change(-HOLD_AMOUNT),
  )
  const plus = usePressAndHold(
    () => change(TAP_AMOUNT),
    () => change(HOLD_AMOUNT),
  )

  return (
    <section
      className={`panel panel--${orientation} panel--player-${player + 1}`}
      aria-label={`Player ${player + 1}`}
    >
      <div className="panel__inner">
        <button
          type="button"
          className="zone zone--minus"
          aria-label={`Player ${player + 1} lose life`}
          {...minus}
        >
          <span className="zone__hint" aria-hidden="true">
            &minus;
          </span>
        </button>
        <button
          type="button"
          className="zone zone--plus"
          aria-label={`Player ${player + 1} gain life`}
          {...plus}
        >
          <span className="zone__hint" aria-hidden="true">
            +
          </span>
        </button>
        <div className="panel__readout">
          <div className="life" aria-live="polite">
            {life < 0 ? `−${-life}` : life}
            <span
              className={`delta${delta.fading ? ' delta--fading' : ''}`}
              aria-hidden="true"
            >
              {formatDelta(delta.value)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
