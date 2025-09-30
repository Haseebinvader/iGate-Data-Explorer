import { useCallback, useMemo, useState } from 'react'
import { useDebounce } from './useDebounce'
import { type RecordItem } from './useDataset'

// ---------------------------------------------
// RecordSortKey
// ---------------------------------------------
// Defines the allowed sort keys. We only allow
// sorting by these specific fields of RecordItem.
export type RecordSortKey = keyof Pick<
  RecordItem,
  'name' | 'category' | 'year' | 'rating'
>

/**
 * ----------------------------------------------------
 * useRecordFilters Hook
 * ----------------------------------------------------
 * Provides filtering and sorting logic for a dataset.
 *
 * Features:
 * - Search by name (debounced for performance)
 * - Filter by category
 * - Sort by field (name, category, year, rating)
 * - Toggle ascending/descending sort
 */
export function useRecordFilters(rows: RecordItem[]) {
  // --------------------------------
  // State: Search, Category, Sorting
  // --------------------------------
  const [query, setQuery] = useState('')                            // search string
  const [category, setCategory] = useState('')                      // active category filter
  const [sortKey, setSortKey] = useState<RecordSortKey>('name')     // active sort column
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')     // sort direction

  // --------------------------------
  // Debounced Query
  // --------------------------------
  // Wait 300ms after typing before applying search,
  // prevents filtering on every keystroke
  const debouncedQuery = useDebounce(query, 300)

  // --------------------------------
  // Categories List
  // --------------------------------
  // Extract unique categories from dataset.
  // Used for the <select> filter dropdown.
  const categories = useMemo(() => {
    return [...new Set(rows.map(row => row.category))].sort()
  }, [rows])

  // --------------------------------
  // Filter + Sort Logic
  // --------------------------------
  const filtered = useMemo(() => {
    // Step 1: Apply search filter
    const searchQuery = debouncedQuery.trim().toLowerCase()
    const filteredRows = rows.filter(row => {
      const matchesQuery =
        !searchQuery || row.name.toLowerCase().includes(searchQuery)
      const matchesCategory = !category || row.category === category
      return matchesQuery && matchesCategory
    })

    // Step 2: Sort results
    const sortedRows = [...filteredRows].sort((a, b) => {
      const valueA = a[sortKey]
      const valueB = b[sortKey]

      if (valueA < valueB) return sortDir === 'asc' ? -1 : 1
      if (valueA > valueB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return sortedRows
  }, [rows, debouncedQuery, sortKey, sortDir, category])

  // --------------------------------
  // Sorting Handler
  // --------------------------------
  // Called when a column header is clicked
  const onSort = useCallback((key: RecordSortKey) => {
    if (key === sortKey) {
      // If already sorting by this key → toggle direction
      setSortDir(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'))
    } else {
      // If switching to new key → reset to ascending
      setSortKey(key)
      setSortDir('asc')
    }
  }, [sortKey, sortDir])

  // --------------------------------
  // Return Hook API
  // --------------------------------
  return {
    // State values (for UI inputs)
    query,
    setQuery,
    category,
    setCategory,
    sortKey,
    sortDir,
    setSortKey,
    setSortDir,

    // Derived values (computed from rows + filters)
    categories,
    filtered,

    // Actions
    onSort,
  }
}
