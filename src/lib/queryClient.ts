import { QueryClient, type DefaultOptions } from '@tanstack/react-query'

// Define default options for React Query
const defaultOptions: DefaultOptions = {
  queries: {
    // Retry failed queries up to 3 times before giving up
    retry: (failureCount) => {
      if (failureCount >= 3) return false
      return true
    },
    // Time (in ms) that data is considered fresh before being marked stale
    staleTime: 30_000, //30 seconds
    // Time (in ms) inactive cache data stays in memory before being garbage collected
    gcTime: 5 * 60_000, //5 minutes
    // Refetch data when the window regains focus
    refetchOnWindowFocus: true,
    // Refetch data when the network reconnects
    refetchOnReconnect: true,
    // Do not refetch data on component mount if data is fresh
    refetchOnMount: false,
    // Do not refetch data in the background when it becomes stale
    refetchInterval: false,
  },
}

//QueryClient instance with the above default options
export const queryClient = new QueryClient({ defaultOptions })
