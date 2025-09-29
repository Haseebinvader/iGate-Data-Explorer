import type { DataTablePaginationProps } from "../lib/Interface";

/**
 * ------------------------------
 * DataTablePagination Component
 * ------------------------------
 * Handles table pagination controls:
 * - Select rows per page
 * - Navigate between pages (first, prev, next, last)
 * - Display current page out of total pages
 */
export function DataTablePagination({
  page,        // Current active page number
  setPage,     // Setter function for page number
  pageSize,    // Number of rows per page
  setPageSize, // Setter function for page size
  totalPages,  // Total number of pages available
}: DataTablePaginationProps) {
  return (
    <div className="flex items-center gap-2">
      {/* ------------------------------
          Page Size Selector
          ------------------------------
          Allows user to select how many rows are shown per page.
      */}
      <label className="text-sm">Rows per page:</label>
      <select
        value={pageSize}
        onChange={e => setPageSize(Number(e.target.value))}
        className="px-2 py-1 border rounded bg-white dark:bg-gray-900"
      >
        {[5, 10, 20].map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {/* ------------------------------
          Pagination Controls
          ------------------------------
          Navigation buttons for switching between pages.
      */}
      <div className="ml-auto flex items-center gap-2 text-sm">
        {/* Jump to first page */}
        <button
          disabled={page <= 1}
          onClick={() => setPage(1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          «
        </button>

        {/* Go to previous page */}
        <button
          disabled={page <= 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          ‹
        </button>

        {/* Display current page / total pages */}
        <span>Page {page} / {totalPages}</span>

        {/* Go to next page */}
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          ›
        </button>

        {/* Jump to last page */}
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(totalPages)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          »
        </button>
      </div>
    </div>
  )
}
