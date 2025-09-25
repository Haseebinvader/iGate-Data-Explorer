import { useMemo, useState } from 'react'
import { useDebounce } from './useDebounce'
import { type RecordItem } from './useDataset'

// Define which fields we can sort by (name, category, year, rating)
export type RecordSortKey = keyof Pick<RecordItem, 'name' | 'category' | 'year' | 'rating'>

export function useRecordFilters(rows: RecordItem[]) {
  // State variables for search query, selected category, sort key, and sort direction
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sortKey, setSortKey] = useState<RecordSortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  // Debounce the search query to avoid unnecessary re-renders
  const debouncedQuery = useDebounce(query, 300)

  // Get the unique categories from the rows, for filtering purposes
  const categories = useMemo(() => {
    return [...new Set(rows.map(row => row.category))].sort()
  }, [rows])

  // Filter and sort rows based on the selected filters (query, category, sorting)
  const filtered = useMemo(() => {
    // Step 1: Apply query filter (search by name)
    const searchQuery = debouncedQuery.trim().toLowerCase()
    const filteredRows = rows.filter(row => {
      const matchesQuery = !searchQuery || row.name.toLowerCase().includes(searchQuery)
      const matchesCategory = !category || row.category === category
      return matchesQuery && matchesCategory
    })

    // Step 2: Sort the filtered rows based on the selected sort key and direction
    const sortedRows = [...filteredRows].sort((a, b) => {
      const valueA = a[sortKey]
      const valueB = b[sortKey]
      
      if (valueA < valueB) return sortDir === 'asc' ? -1 : 1
      if (valueA > valueB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return sortedRows
  }, [rows, debouncedQuery, sortKey, sortDir, category])

  // Function to handle sorting when the user will click column to sort by
  const onSort = (key: RecordSortKey) => {
    if (key === sortKey) {
      // If already sorting by this key, toggle the direction
      setSortDir(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'))
    } else {
      // If sorting by a new key, set the new key and default to ascending
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return {
    // State values
    query,
    setQuery,
    category,
    setCategory,
    sortKey,
    sortDir,
    setSortKey,
    setSortDir,

    // Derived values (calculated based on filters)
    categories,
    filtered,

    // Sorting action
    onSort,
  }
}
