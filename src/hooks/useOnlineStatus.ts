import { useEffect, useState } from 'react'

// Custom hook to track whether the user is online or offline
export function useOnlineStatus() {
  // Initialize state:
  // - If running in a browser, use navigator.onLine (true = online, false = offline)
  // - If running in SSR/Node (no navigator), default to "true" to avoid errors
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    // Event handlers for online/offline changes
    const on = () => setOnline(true)
    const off = () => setOnline(false)

    // Listen to browser online/offline events
    window.addEventListener('online', on)
    window.addEventListener('offline', off)

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  // Return the current online status (boolean)
  return online
}
