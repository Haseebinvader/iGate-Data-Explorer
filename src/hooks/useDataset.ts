import { useQuery } from '@tanstack/react-query'
import { getCached, setCached } from '../lib/storage'

// ------------------------------
// RecordItem type
// ------------------------------
// Defines the shape of one dataset record.
// Used consistently across the app (table, filters, exports, etc.).
export type RecordItem = {
  id: number
  name: string
  category: string
  year: number
  rating: number
  image: string
}

// Key used for local cache storage
const CACHE_KEY = 'dataset-v1'

/**
 * ------------------------------
 * fetchDataset
 * ------------------------------
 * Fetches dataset records with an "offline-first" strategy:
 * 1. Try to load from local storage cache
 * 2. If not available, fetch from API (`/api/latestblock`)
 * 3. Transform the response into a synthetic dataset
 * 4. Save results to cache for next time
 */
async function fetchDataset(): Promise<RecordItem[]> {
  // 1. Offline-first: check cache first
  const cached = await getCached<RecordItem[]>(CACHE_KEY)
  if (cached && cached.length) return cached

  // 2. Otherwise, fetch latest block from API
  const res = await fetch('/api/latestblock')
  if (!res.ok) throw new Error('Failed to load dataset')

  // Expected API response shape from blockchain.info-like API
  const raw = await res.json() as {
    hash: string
    time: number
    block_index: number
    height: number
    txIndexes?: number[]
  }

  // 3. Base record derived from block data
  const year = new Date(raw.time * 1000).getFullYear()
  const base: RecordItem = {
    id: 1,
    name: raw.hash.slice(0, 12),              // use first 12 chars of block hash
    category: 'block',                        // default category
    year,                                     // year from block timestamp
    rating: raw.height % 6,                   // rating from block height (0–5)
    image: `https://picsum.photos/seed/${raw.hash.slice(0, 8)}/80/80`, // placeholder image
  }

  // 4. Expand into multiple synthetic records
  // - Count based on transaction count (txIndexes) or fallback to 200
  const count = Math.max(1, raw.txIndexes?.length ?? 200)
  let out = Array.from({ length: count }, (_, i) => ({
    ...base,
    id: i + 1,                                // unique id per record
    name: `${base.name}-${i + 1}`,            // unique name per record
    category: i % 3 === 0 ? 'A' : i % 3 === 1 ? 'B' : 'C', // cycle categories A/B/C
    rating: i % 6,                            // cycle ratings 0–5
    image: `https://picsum.photos/seed/${base.name}-${i}/80/80`, // unique image seed
  }))

  // 5. Save transformed dataset to local cache
  await setCached(CACHE_KEY, out)

  // 6. Return dataset to caller
  return out
}

/**
 * ------------------------------
 * useDataset
 * ------------------------------
 * Custom hook wrapping React Query's useQuery.
 *
 * - Handles fetching & caching automatically
 * - Query key: ['dataset'] ensures consistency across app
 * - Returns query object (status, data, error, etc.)
 */
export function useDataset() {
  return useQuery({
    queryKey: ['dataset'], // unique cache key for React Query
    queryFn: fetchDataset, // data fetching function
  })
}
