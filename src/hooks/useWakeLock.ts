import { useEffect } from 'react'
import NoSleep from 'nosleep.js'

/**
 * Keeps the screen awake while `active`. Uses the Screen Wake Lock API and
 * re-acquires it when the page becomes visible again (the browser drops the
 * lock whenever the page is hidden). Where the API is missing or the request
 * is refused, NoSleep.js is enabled on the next touch, since it needs a user
 * gesture.
 */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return

    let cancelled = false
    let sentinel: WakeLockSentinel | null = null
    let noSleep: NoSleep | null = null
    let fallbackArmed = false

    const enableFallback = () => {
      fallbackArmed = false
      if (cancelled) return
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

    const acquire = async () => {
      if (noSleep?.isEnabled) return
      if ('wakeLock' in navigator) {
        try {
          const lock = await navigator.wakeLock.request('screen')
          if (cancelled) {
            void lock.release()
            return
          }
          sentinel = lock
          return
        } catch {
          // Refused (battery saver, permissions policy, ...): fall through.
        }
      }
      if (!cancelled) armFallback()
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void acquire()
    }

    void acquire()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibilityChange)
      document.removeEventListener('pointerdown', enableFallback)
      void sentinel?.release().catch(() => {})
      noSleep?.disable()
    }
  }, [active])
}
