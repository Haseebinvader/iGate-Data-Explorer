import localforage from 'localforage'

// ----------------------------------------------------
// LocalForage Configuration
// ----------------------------------------------------
// LocalForage is a wrapper around IndexedDB (with fallbacks
// to WebSQL and localStorage) that provides async storage.
//
// - `name`: database namespace (like a project DB name)
// - `storeName`: object store (like a table in IndexedDB)
localforage.config({
  name: 'data-explorer',
  storeName: 'kv',
})

/**
 * ----------------------------------------------------
 * getCached
 * ----------------------------------------------------
 * Retrieve a cached value from localforage.
 *
 * @param key - string key to lookup
 * @returns Promise<T | null> → parsed value or null if not found
 *
 * Notes:
 * - Generic <T> allows strong typing of returned value
 * - Returns `null` if value does not exist or on error
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    // Try to fetch the item by key
    const value = await localforage.getItem<T>(key)

    // Explicitly coerce undefined → null
    return value ?? null
  } catch {
    // If retrieval fails (corrupt DB, quota errors, etc.)
    // Return null safely (fail silently)
    return null
  }
}

/**
 * ----------------------------------------------------
 * setCached
 * ----------------------------------------------------
 * Store a value in localforage under a given key.
 *
 * @param key - string key to store under
 * @param value - any serializable value (object, array, string, etc.)
 * @returns Promise<void>
 *
 * Notes:
 * - Data is persisted in IndexedDB when available
 * - Silently ignores errors (e.g., quota exceeded)
 */
export async function setCached<T>(key: string, value: T): Promise<void> {
  try {
    // Save item in async storage
    await localforage.setItem<T>(key, value)
  } catch {
    // Ignore errors (do not throw, to avoid breaking app flow)
  }
}
