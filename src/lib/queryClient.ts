import { QueryClient, type DefaultOptions } from '@tanstack/react-query'

// ----------------------------------------------------
// Default React Query options
// ----------------------------------------------------
// These control how queries behave globally across the app.
const defaultOptions: DefaultOptions = {
  queries: {
    // --------------------------------
    // Retry strategy
    // --------------------------------
    // Retry failed queries up to 3 times before giving up.
    // After the 3rd failure, the error will surface to the UI.
    retry: (failureCount) => {
      if (failureCount >= 3) return false
      return true
    },

    // --------------------------------
    // Caching / Stale settings
    // --------------------------------
    // Time (ms) before fetched data is considered "stale"
    // Stale data can still be used from cache while background refetch occurs
    staleTime: 30_000, // 30 seconds

    // Time (ms) inactive cache data stays in memory before garbage collection
    gcTime: 5 * 60_000, // 5 minutes

    // --------------------------------
    // Refetch behavior
    // --------------------------------
    // Automatically refetch when the window regains focus (e.g., user tabs back)
    refetchOnWindowFocus: true,

    // Automatically refetch when the browser reconnects after going offline
    refetchOnReconnect: true,

    // Do not refetch on component mount if cached data is still "fresh"
    refetchOnMount: false,

    // Disable automatic background polling (can be set per-query if needed)
    refetchInterval: false,
  },
}

// ----------------------------------------------------
// QueryClient instance
// ----------------------------------------------------
// Provides React Query context with the above default options.
// This is usually passed to <QueryClientProvider>.
export const queryClient = new QueryClient({ defaultOptions })
