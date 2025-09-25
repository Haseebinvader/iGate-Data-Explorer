import { useRef, useState, useEffect } from 'react'
import { useResourceTracker } from '../hooks/useResourceTracker'
import { useRecordFilters} from '../hooks/useRecordFilters'
import { Ascending, Descending } from './IoncsSvg'
import type { DataTableProps, SortKey } from '../lib/Interface'


export function DataTable({ rows }:DataTableProps) {
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
  const viewportRef = useRef<HTMLDivElement | null>(null)
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

  // Virtualized rendering within current page
  const totalHeight = pageRows.length * rowHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 5) // overscan above
  const endIndex = Math.min(pageRows.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + 5) // overscan below
  const visibleRows = pageRows.slice(startIndex, endIndex)
  const offsetY = startIndex * rowHeight

  // Handle scroll position for virtualization
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setScrollTop(target.scrollTop)
  }

  // Track viewport height dynamically (resizing container)
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setViewportHeight(el.clientHeight))
    ro.observe(el)
    setViewportHeight(el.clientHeight)
    return () => ro.disconnect()
  }, [])

  // Column Drag & Drop for reordering
  const dragCol = useRef<SortKey | null>(null)

  const handleDragStart = (key: SortKey) => (e: React.DragEvent) => {
    dragCol.current = key
    e.dataTransfer.setData('text/plain', key) // required for drag events
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (key: SortKey | 'image') => (e: React.DragEvent) => {
    if (key === 'image') return // "image" column cannot be reordered
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (key: SortKey) => (e: React.DragEvent) => {
    e.preventDefault()
    const from = dragCol.current
    if (!from || from === key) return
    setColumnOrder(prev => {
      const cols = prev.filter(c => c !== from)
      const idx = cols.indexOf(key)
      cols.splice(idx, 0, from) // insert dragged column before drop target
      return cols
    })
    dragCol.current = null
  }

  return (
    <div className="space-y-3">
      {/* Filters & Search */}
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
        <div className="text-sm opacity-70">Results: {filtered.length}</div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        <label className="text-sm">Rows per page:</label>
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          className="px-2 py-1 border rounded bg-white dark:bg-gray-900"
        >
          {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-2 text-sm">
          <button disabled={page <= 1} onClick={() => setPage(1)} className="px-2 py-1 border rounded disabled:opacity-50">«</button>
          <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-2 py-1 border rounded disabled:opacity-50">‹</button>
          <span>Page {page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-2 py-1 border rounded disabled:opacity-50">›</button>
          <button disabled={page >= totalPages} onClick={() => setPage(totalPages)} className="px-2 py-1 border rounded disabled:opacity-50">»</button>
        </div>
      </div>

      {/* Resource Tracker Warning */}
      {tracker.warning && (
        <div className="text-xs text-amber-700 dark:text-amber-400">
          {tracker.warning} {tracker.memoryMB ? `(~${tracker.memoryMB} MB)` : ''}
        </div>
      )}

      {/* Table with Virtualized Rows */}
      <div
        ref={viewportRef}
        onScroll={onScroll}
        style={{ maxHeight: 480 }}
        className="overflow-auto border rounded"
      >
        <table className="min-w-full border-collapse">
          {/*Table Header */}
          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              {columnOrder.map(col => {
                if (col === 'image') {
                  // Non-draggable "Image" column
                  return (
                    <th
                      key="image"
                      className="p-4 text-left sticky left-0 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700"
                    >
                      <span className="font-medium text-gray-700 dark:text-gray-200">Image</span>
                    </th>
                  )
                }
                // Draggable + sortable columns
                return (
                  <th
                    key={col}
                    className="p-4 text-left cursor-pointer select-none relative group hover:bg-gray-200 dark:hover:bg-gray-700 border-b border-gray-300 dark:border-gray-700"
                    onClick={() => onSort(col)}
                    draggable
                    onDragStart={handleDragStart(col)}
                    onDragOver={handleDragOver(col)}
                    onDrop={handleDrop(col)}
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                    </span>
                    {/* Sorting indicator */}
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      {sortKey === col && (sortDir === 'asc' ? <Ascending /> : <Descending />)}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
  {filtered.length === 0 && (
    <tr>
      <td colSpan={columnOrder.length} className="p-4 text-center text-sm">
        No results found.
      </td>
    </tr>
  )}

  {visibleRows.map(row => (
    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
      {columnOrder.map(col => (
        <td
          key={col}
          className={`px-2 py-3 border-b dark:border-gray-700 ${
            col === 'image' ? 'sticky left-0 bg-white dark:bg-gray-950' : ''
          }`}
        >
          {col === 'image' ? (
            <img
              src={row.image}
              alt={row.name}
              loading="lazy"
              width={40}
              height={40}
              className="rounded"
            />
          ) : (
            String(row[col])
          )}
        </td>
      ))}
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  )
}
