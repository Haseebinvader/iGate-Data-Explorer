import { useEffect, useState } from 'react'

/**
 * ----------------------------------------------------
 * useDebounce Hook
 * ----------------------------------------------------
 * Returns a "debounced" version of a value.
 *
 * - Useful for search inputs, filters, or any situation
 *   where you want to wait until the user stops typing
 *   before performing an expensive action (e.g., API call).
 *
 * Example:
 * const debouncedQuery = useDebounce(query, 500)
 * // debouncedQuery only updates 500ms after user stops typing
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  // --------------------------------
  // State to hold the debounced value
  // --------------------------------
  // - Starts with the current value
  // - Will only update after the timer completes
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    // --------------------------------
    // Start debounce timer
    // --------------------------------
    // - After `delayMs`, update debounced state to latest value
    const id = setTimeout(() => setDebounced(value), delayMs)

    // --------------------------------
    // Cleanup on value/delay change
    // --------------------------------
    // - Clears previous timer if user types again quickly
    // - Ensures only the last change after the delay updates state
    return () => clearTimeout(id)
  }, [value, delayMs]) // Effect re-runs whenever input value or delay changes

  // --------------------------------
  // Return the debounced value
  // --------------------------------
  // - Will "lag" behind the input value by `delayMs` ms
  return debounced
}
