import type { DataTableFiltersProps } from "../lib/Interface";

export function DataTableFilters({
  query,
  setQuery,
  category,
  setCategory,
  categories,
  resultCount,
}: DataTableFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by name..."
        className="px-3 py-2 border rounded w-60 bg-white dark:bg-gray-900"
      />
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
      <div className="text-sm opacity-70">Results: {resultCount}</div>
    </div>
  )
}