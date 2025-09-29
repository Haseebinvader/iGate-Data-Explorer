import type { DataTableFiltersProps } from "../lib/Interface";

/**
 * ------------------------------
 * DataTableFilters Component
 * ------------------------------
 * Provides filtering controls for the DataTable:
 * - Text input for search queries
 * - Dropdown for category selection
 * - Display of current result count
 */
export function DataTableFilters({
  query,         // Current search query string
  setQuery,      // Setter function for search query
  category,      // Currently selected category
  setCategory,   // Setter function for category
  categories,    // List of available categories
  resultCount,   // Number of filtered results
}: DataTableFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* ------------------------------
          Search Input
          ------------------------------
          Allows filtering by name. Updates query state on input.
      */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by name..."
        className="px-3 py-2 border rounded w-60 bg-white dark:bg-gray-900"
      />

      {/* ------------------------------
          Category Dropdown
          ------------------------------
          Filters dataset by category.
          "All categories" resets the filter.
      */}
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="px-3 py-2 border rounded bg-white dark:bg-gray-900"
      >
        <option value="">All categories</option>
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* ------------------------------
          Result Count
          ------------------------------
          Displays number of results after filtering.
      */}
      <div className="text-sm opacity-70">Results: {resultCount}</div>
    </div>
  )
}
