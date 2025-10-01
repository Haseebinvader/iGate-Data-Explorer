import { useQuery } from "@tanstack/react-query";
import { getCached, setCached } from "../lib/storage";

// ------------------------------
// RecordItem type
// ------------------------------
// Defines the shape of one dataset record.
// Used consistently across the app (table, filters, exports, etc.).
export type RecordItem = {
  id: number;
  name: string;
  category: string;
  year: number;
  rating: number;
  image: string;
  isLoading?: boolean;
};

// ------------------------------
// Cache configuration
// ------------------------------
const CACHE_KEY = "dataset"; // localforage key for storing dataset
const CACHE_VERSION = 1; // ⬅️ bump this when transformation logic changes

type CachedPayload = {
  version: number;
  data: RecordItem[];
};

/**
 * ------------------------------
 * fetchDataset
 * ------------------------------
 * Fetches dataset records with an "offline-first" strategy:
 * 1. Try to load from local storage cache (if version matches)
 * 2. If not available or version mismatch, fetch from API (`/api/latestblock`)
 * 3. Transform the response into a synthetic dataset
 * 4. Save results to cache for next time
 */
// useDataset.ts
async function fetchDataset(): Promise<RecordItem[]> {
  const cached = await getCached<CachedPayload>(CACHE_KEY);
  if (cached && cached.version === CACHE_VERSION && cached.data.length) {
    return cached.data;
  }

  const res = await fetch("https://blockchain.info/api/latestblock");
  if (!res.ok) throw new Error("Failed to load dataset");

  const raw = await res.json();
  const year = new Date(raw.time * 1000).getFullYear();
  const base: RecordItem = {
    id: 1,
    name: raw.hash.slice(22, 34),
    category: "block",
    year,
    rating: raw.height % 6,
    image: `https://picsum.photos/seed/${raw.hash.slice(22, 34)}/80/80`,
  };

  const count = Math.max(1, raw.txIndexes?.length ?? 200);
  const out: RecordItem[] = Array.from({ length: count }, (_, i) => ({
    ...base,
    id: i + 1,
    name: `${base.name}-${String(i + 1).padStart(3, "0")}`,
    category: i % 3 === 0 ? "A" : i % 3 === 1 ? "B" : "C",
    rating: i % 6,
    image: `https://picsum.photos/seed/${base.name}-${i}/80/80`,
  }));
  await setCached(CACHE_KEY, { version: CACHE_VERSION, data: out });
  return out;
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
    queryKey: ["dataset"], // unique cache key for React Query
    queryFn: fetchDataset, // data fetching function
  });
}
