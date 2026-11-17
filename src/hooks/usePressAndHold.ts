import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'

const HOLD_DELAY_MS = 500
const HOLD_REPEAT_MS = 500

/**
 * A quick press calls onTap on release. Holding calls onHold after a delay
 * and keeps repeating until release; a hold never also counts as a tap.
 */
export function usePressAndHold(onTap: () => void, onHold: () => void) {
  const callbacks = useRef({ onTap, onHold })
  const timer = useRef<number | undefined>(undefined)
  const activePointer = useRef<number | null>(null)
  const held = useRef(false)

  useEffect(() => {
    callbacks.current = { onTap, onHold }
  })

  const stop = () => {
    window.clearTimeout(timer.current)
    timer.current = undefined
    activePointer.current = null
  }

  useEffect(() => stop, [])

  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (activePointer.current !== null || event.button !== 0) return
      // Touch pointers are captured implicitly; release so that sliding off
      // the zone fires pointerleave and cancels the press.
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      activePointer.current = event.pointerId
      held.current = false
      const fire = () => {
        held.current = true
        callbacks.current.onHold()
        timer.current = window.setTimeout(fire, HOLD_REPEAT_MS)
      }
      timer.current = window.setTimeout(fire, HOLD_DELAY_MS)
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      if (event.pointerId !== activePointer.current) return
      stop()
      if (!held.current) callbacks.current.onTap()
    },
    onPointerLeave(event: PointerEvent<HTMLElement>) {
      if (event.pointerId === activePointer.current) stop()
    },
    onPointerCancel(event: PointerEvent<HTMLElement>) {
      if (event.pointerId === activePointer.current) stop()
    },
    onKeyDown(event: KeyboardEvent<HTMLElement>) {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      callbacks.current.onTap()
    },
  }
}
