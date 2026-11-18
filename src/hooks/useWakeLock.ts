import { useEffect } from 'react'
import NoSleep from 'nosleep.js'

// With no touches or key presses for this long, the lock is released even
// if the app is in front, so a forgotten game doesn't keep the screen on.
const IDLE_MS = 5 * 60 * 1000

/**
 * Keeps the screen awake while `active` and the app is in use: the page is
 * visible, its window has focus, and someone has touched it in the last
 * IDLE_MS. The browser already drops the lock when the page is hidden, but
 * a window left open behind another one still counts as visible, so losing
 * focus releases it too. Whenever the lock is released, the device's own
 * sleep settings apply; the next touch or return to the app takes it back.
 *
 * Uses the Screen Wake Lock API. Where it is missing or the request is
 * refused, NoSleep.js is enabled on the next touch, since it needs a user
 * gesture.
 */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return

    let cancelled = false
    let sentinel: WakeLockSentinel | null = null
    let noSleep: NoSleep | null = null
    let fallbackArmed = false
    let idle = false
    let idleTimer: number | undefined

    const inUse = () =>
      !idle && document.visibilityState === 'visible' && document.hasFocus()

    const enableFallback = () => {
      fallbackArmed = false
      if (cancelled || !inUse()) return
      noSleep ??= new NoSleep()
      noSleep.enable().catch(() => {
        // Nothing left to try; the screen may dim.
      })
    }

    const armFallback = () => {
      if (fallbackArmed || noSleep?.isEnabled) return
      fallbackArmed = true
      document.addEventListener('pointerdown', enableFallback, { once: true })
    }

    const release = () => {
      if (fallbackArmed) {
        fallbackArmed = false
        document.removeEventListener('pointerdown', enableFallback)
      }
      void sentinel?.release().catch(() => {})
      sentinel = null
      noSleep?.disable()
    }

    const acquire = async () => {
      if ((sentinel && !sentinel.released) || noSleep?.isEnabled) return
      if ('wakeLock' in navigator) {
        try {
          const lock = await navigator.wakeLock.request('screen')
          // Focus or visibility may have been lost while the request was
          // pending.
          if (cancelled || !inUse()) {
            void lock.release()
            return
          }
          sentinel = lock
          return
        } catch {
          // Refused (battery saver, permissions policy, ...): fall through.
        }
      }
      if (!cancelled && inUse()) armFallback()
    }

    const update = () => {
      if (inUse()) void acquire()
      else release()
    }

    const onActivity = () => {
      idle = false
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => {
        idle = true
        update()
      }, IDLE_MS)
      update()
    }

    onActivity()
    document.addEventListener('visibilitychange', update)
    window.addEventListener('focus', update)
    window.addEventListener('blur', update)
    // Capture phase, so no handler in the app can stop these reaching here.
    document.addEventListener('pointerdown', onActivity, true)
    document.addEventListener('keydown', onActivity, true)

    return () => {
      cancelled = true
      window.clearTimeout(idleTimer)
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('focus', update)
      window.removeEventListener('blur', update)
      document.removeEventListener('pointerdown', onActivity, true)
      document.removeEventListener('keydown', onActivity, true)
      release()
    }
  }, [active])
}
