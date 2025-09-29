import { useEffect, useState } from 'react'

/**
 * ----------------------------------------------------
 * useOnlineStatus Hook
 * ----------------------------------------------------
 * Tracks whether the user is currently online or offline.
 *
 * - Uses the browser's `navigator.onLine` property
 * - Subscribes to `online` and `offline` events
 * - Cleans up listeners automatically on unmount
 *
 * Example:
 * const isOnline = useOnlineStatus()
 * return <p>{isOnline ? "✅ Online" : "❌ Offline"}</p>
 */
export function useOnlineStatus() {
  // --------------------------------
  // Initialize state
  // --------------------------------
  // - If in a browser, read `navigator.onLine`:
  //    - true  = online
  //    - false = offline
  // - If in SSR/Node (no navigator object), default to `true`
  //   to avoid hydration mismatch errors
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    // --------------------------------
    // Event handlers for status changes
    // --------------------------------
    const on = () => setOnline(true)   // Triggered when browser goes online
    const off = () => setOnline(false) // Triggered when browser goes offline

    // --------------------------------
    // Attach event listeners
    // --------------------------------
    window.addEventListener('online', on)
    window.addEventListener('offline', off)

    // --------------------------------
    // Cleanup on unmount
    // --------------------------------
    // Remove listeners to prevent memory leaks
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  // --------------------------------
  // Return current online status
  // --------------------------------
  return online // true = online, false = offline
}
