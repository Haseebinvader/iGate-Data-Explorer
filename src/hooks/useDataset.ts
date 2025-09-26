import { useQuery } from '@tanstack/react-query'
import { getCached, setCached } from '../lib/storage'

// Define the structure of a dataset record
export type RecordItem = {
  id: number
  name: string
  category: string
  year: number
  rating: number
  image: string
}

const CACHE_KEY = 'dataset-v1'

// Fetch function used by React Query
async function fetchDataset(): Promise<RecordItem[]> {
  // 1. Offline-first: try to load from local cache first
  const cached = await getCached<RecordItem[]>(CACHE_KEY)
  if (cached && cached.length) return cached

  // 2. Otherwise, fetch from API
  const res = await fetch('/api/latestblock')
  if (!res.ok) throw new Error('Failed to load dataset')

  // API response shape
  const raw = await res.json() as {
    hash: string
    time: number
    block_index: number
    height: number
    txIndexes?: number[]
  }

  // 3. Transform the single latest block into many synthetic records
  const year = new Date(raw.time * 1000).getFullYear()
  const base: RecordItem = {
    id: 1,
    name: raw.hash.slice(0, 12),              // use first 12 chars of block hash
    category: 'block',
    year,
    rating: raw.height % 6,                   // rating from 0–5
    image: `https://picsum.photos/seed/${raw.hash.slice(0, 8)}/80/80`, // placeholder image
  }

  // 4. Create multiple records based on tx count (or fallback to 200)
  const count = Math.max(1, raw.txIndexes?.length ?? 200)
  let out = Array.from({ length: count }, (_, i) => ({
    ...base,
    id: i + 1,
    name: `${base.name}-${i + 1}`,           // unique name per record
    category: i % 3 === 0 ? 'A' : i % 3 === 1 ? 'B' : 'C', // cycle A/B/C
    rating: i % 6,                           // cycle 0–5
    image: `https://picsum.photos/seed/${base.name}-${i}/80/80`, // unique seed
  }))

  // 6. Cache the transformed dataset for offline/next-time use
  await setCached(CACHE_KEY, out)

  return out
}

// Hook that wraps React Query's useQuery with the fetch function
export function useDataset() {
  return useQuery({
    queryKey: ['dataset'], // unique key for caching
    queryFn: fetchDataset, // function that fetches the data
  })
}
