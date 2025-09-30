import { useRef, useState, useEffect } from 'react'
import { type RecordItem } from '../hooks/useDataset'
import { useResourceTracker } from '../hooks/useResourceTracker'
import { useRecordFilters, type RecordSortKey } from '../hooks/useRecordFilters'
import { DataTablePagination } from './DataTablePagination'
import { DataTableResourceWarning } from './DataTableResourceWarning'
import { DataTableFilters } from './DataTableFilters'
import { DataTable } from './DataTable'
import { exportCSV, exportJSON } from '../lib/exports' // Assuming the export functions are imported
import { ErrorBoundary } from './ErrorBoundary'

type SortKey = RecordSortKey

export function DataTableExplorer({ rows, isLoading }: { rows: RecordItem[], isLoading: boolean }) {
  // Filtering + sorting state and utilities (custom hook)
  const {
    query,
    setQuery,
    category,
    setCategory,
    sortKey,
    sortDir,
    categories,
    filtered,
    onSort,
  } = useRecordFilters(rows)

  // Order of displayed columns (image is special + fixed)
  const [columnOrder, setColumnOrder] = useState<Array<SortKey | 'image'>>([
    'image', 'name', 'category', 'year', 'rating'
  ])

  // Pagination state
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(1)

  // Virtualization config
  const rowHeight = 50
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(400)

  // Track resource usage (memory warning, etc.)
  const tracker = useResourceTracker('DataTable', filtered.length)

  // Reset to page 1 whenever filters/pagination settings change
  useEffect(() => {
    setPage(1)
    if (viewportRef.current) viewportRef.current.scrollTop = 0
  }, [query, category, sortKey, sortDir, pageSize])

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageStart = (page - 1) * pageSize
  const pageRows = filtered.slice(pageStart, pageStart + pageSize)

  return (
    <div className="space-y-3">
      {/* Filters and other controls */}
      <DataTableFilters
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        categories={categories}
        resultCount={filtered.length}
      />

      {/* Pagination */}
      <DataTablePagination
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
      />

      {/* Resource Warning */}
      <DataTableResourceWarning
        tracker={{
          ...tracker,
          warning: tracker.warning ?? undefined,
          memoryMB: tracker.memoryMB ?? undefined,
        }}
      />

      {/* Data Table */}
      <ErrorBoundary
      fallback={
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold">Something went wrong!</h2>
          <p>Please try again later.</p>
        </div>
      }
      onError={(error, errorInfo) => {
        // Log or report the error as needed
        console.error('Error caught in DataTable:', error, errorInfo)
      }}
      onRetry={() => {
        // Optionally trigger a retry if necessary
        console.log('Retrying DataTable render...')
      }}
    >
      <DataTable
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
        pageRows={pageRows}
        rowHeight={rowHeight}
        viewportRef={viewportRef}
        scrollTop={scrollTop}
        setScrollTop={setScrollTop}
        viewportHeight={viewportHeight}
        setViewportHeight={setViewportHeight}
        filteredLength={filtered.length}
        isLoading={isLoading}
      />
    </ErrorBoundary>

      {/* Export buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-3 py-1.5 rounded border"
          onClick={() => exportCSV(filtered, 'filtered.csv')} // Export only filtered data
        >
          Export CSV
        </button>

        <button
          className="px-3 py-1.5 rounded border"
          onClick={() => exportJSON(filtered, 'filtered.json')} // Export only filtered data
        >
          Export JSON
        </button>
      </div>
    </div>
  )
}
