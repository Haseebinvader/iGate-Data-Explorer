import { useEffect, useState } from 'react'

// A custom hook that delays updating a value until after a given delay
export function useDebounce<T>(value: T, delayMs = 300): T {
  // State to store the debounced value
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    // Set up a timer that updates debounced value after delayMs
    const id = setTimeout(() => setDebounced(value), delayMs)

    // Cleanup function: clears the timer if value/delay changes
    // Prevents updating too often when user keeps typing/changing value
    return () => clearTimeout(id)
  }, [value, delayMs]) // Re-run effect whenever input value or delay changes

  // Return the debounced value (lags behind the input value by delayMs)
  return debounced
}
