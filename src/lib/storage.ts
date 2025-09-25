import localforage from 'localforage'

// Configure localforage storage
// - `name`: database name (like a project namespace)
// - `storeName`: object store (like a table in IndexedDB)
localforage.config({
  name: 'data-explorer',
  storeName: 'kv',
})

/**
 * Get a cached value from localforage
 * @param key - the key under which the value is stored
 * @returns the value if found, or null if not found / error
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    // Try to retrieve the item by key
    const value = await localforage.getItem<T>(key)
    // Return the value if it exists, otherwise null
    return value ?? null
  } catch {
    // If any error happens (e.g. storage issue), return null
    return null
  }
}

/**
 * Store a value in localforage
 * @param key - the key to store under
 * @param value - the value to store (can be object, array, string, etc.)
 */
export async function setCached<T>(key: string, value: T): Promise<void> {
  try {
    // Save the value under the given key
    await localforage.setItem<T>(key, value)
  } catch {
    // If saving fails (e.g. quota exceeded), ignore silently
  }
}
