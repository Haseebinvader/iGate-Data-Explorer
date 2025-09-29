import { useEffect, useRef, useState } from 'react'

/**
 * ----------------------------------------------------
 * useResourceTracker Hook
 * ----------------------------------------------------
 * Tracks basic runtime stats for a React component:
 * - Render count
 * - Approx. memory usage (Chrome-only)
 * - Optional performance warning if rendering too many rows
 *
 * Example:
 * const { renders, memoryMB, warning } = useResourceTracker("DataTable", rows.length)
 */
export function useResourceTracker(componentName: string, rowCount?: number) {
  // --------------------------------
  // Render count
  // --------------------------------
  // - useRef persists across renders without causing re-renders
  // - Increment on every render to count how many times this component re-rendered
  const renders = useRef(0)
  renders.current += 1

  // --------------------------------
  // Memory usage (in MB)
  // --------------------------------
  // - Null if not available
  // - Uses Chrome's non-standard `performance.memory` API
  const [memoryMB, setMemoryMB] = useState<number | null>(null)

  useEffect(() => {
    // Attempt to read memory usage (works only in Chrome)
    const nav = (performance as any).memory
    if (nav && typeof nav.usedJSHeapSize === 'number') {
      // Convert bytes → MB and round to 1 decimal place
      setMemoryMB(
        Math.round((nav.usedJSHeapSize / (1024 * 1024)) * 10) / 10
      )
    }
    // No dependencies → runs after every render
  })

  // --------------------------------
  // Performance warning
  // --------------------------------
  // If rowCount is provided and very large, return a warning message
  const warning =
    rowCount && rowCount > 5000
      ? `${componentName}: rendering ${rowCount} rows may impact performance.`
      : null

  // --------------------------------
  // Return API
  // --------------------------------
  return {
    renders: renders.current, // Number of renders so far
    memoryMB,                 // Current memory usage in MB (or null if unavailable)
    warning                   // Performance warning string (or null)
  }
}
