import { useEffect, useRef, useState } from 'react'

// Custom hook to track renders, memory usage, and performance warnings
export function useResourceTracker(componentName: string, rowCount?: number) {
  // Track the number of times the component has rendered
  const renders = useRef(0)
  // Store the memory usage in MB (null if unavailable)
  const [memoryMB, setMemoryMB] = useState<number | null>(null)

  // Increment render count on every render
  renders.current += 1

  useEffect(() => {
    // Access the performance.memory API (only available in Chrome-based browsers)
    const nav = (performance as any).memory
    if (nav && typeof nav.usedJSHeapSize === 'number') {
      // Convert bytes → MB and round to 1 decimal place
      setMemoryMB(Math.round((nav.usedJSHeapSize / (1024 * 1024)) * 10) / 10)
    }
  })

  // Show a performance warning if rowCount is very large
  const warning =
    rowCount && rowCount > 5000
      ? `${componentName}: rendering ${rowCount} rows may impact performance.`
      : null

  // Return the tracked values
  return { 
    renders: renders.current, // Number of renders so far
    memoryMB,                 // Current memory usage in MB
    warning                   // Performance warning (if applicable)
  }
}
