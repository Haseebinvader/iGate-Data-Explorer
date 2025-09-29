import React, { useRef, useEffect } from 'react'
import { Ascending, Descending } from './IoncsSvg'
import { type RecordSortKey } from '../hooks/useRecordFilters'
import { type RecordItem } from '../hooks/useDataset'

type SortKey = RecordSortKey

interface DataTableTableProps {
  columnOrder: Array<SortKey | 'image'>                // The order of columns in the table
  setColumnOrder: React.Dispatch<React.SetStateAction<Array<SortKey | 'image'>>> // Setter for column reordering
  sortKey: SortKey                                     // Currently sorted column
  sortDir: 'asc' | 'desc'                              // Current sort direction
  onSort: (key: SortKey) => void                       // Callback to trigger sorting
  pageRows: RecordItem[]                               // Data rows to render
  rowHeight: number                                    // Fixed height for each row (used for virtualization)
  viewportRef: React.RefObject<HTMLDivElement | null>  // Ref to the scrollable viewport
  scrollTop: number                                    // Current vertical scroll position
  setScrollTop: (n: number) => void                    // Setter for scrollTop
  viewportHeight: number                               // Visible viewport height
  setViewportHeight: (n: number) => void               // Setter for viewport height
  filteredLength: number                               // Number of rows after filtering
}

export function DataTable({
  columnOrder,
  setColumnOrder,
  sortKey,
  sortDir,
  onSort,
  pageRows,
  rowHeight,
  viewportRef,
  scrollTop,
  setScrollTop,
  viewportHeight,
  setViewportHeight,
  filteredLength,
}: DataTableTableProps) {
  /**
   * ------------------------------
   * Virtualization calculations
   * ------------------------------
   * Instead of rendering *all* rows, only render the visible slice + some buffer rows.
   * This improves performance for large datasets.
   */
  const totalHeight = pageRows.length * rowHeight // total pixel height of all rows
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 5) // index of first visible row (with buffer)
  const endIndex = Math.min(pageRows.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + 5) // last visible row
  const visibleRows = pageRows.slice(startIndex, endIndex) // slice of rows to actually render
  const offsetY = startIndex * rowHeight // space to "push down" rendered rows

  /**
   * ------------------------------
   * Track viewport height
   * ------------------------------
   * Uses ResizeObserver to detect when the container changes size
   * and updates viewportHeight accordingly (for responsive layouts).
   */
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setViewportHeight(el.clientHeight))
    ro.observe(el)
    setViewportHeight(el.clientHeight) // initialize on mount
    return () => ro.disconnect()
  }, [viewportRef, setViewportHeight])

  /**
   * ------------------------------
   * Scroll handling
   * ------------------------------
   * Updates scrollTop state on scroll, which is used for virtualization.
   */
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  /**
   * ------------------------------
   * Column Drag & Drop
   * ------------------------------
   * Allows reordering of table columns by dragging headers.
   */
  const dragCol = useRef<SortKey | null>(null) // track currently dragged column

  // Start dragging: store column key in ref and dataTransfer
  const handleDragStart = (key: SortKey) => (e: React.DragEvent) => {
    dragCol.current = key
    e.dataTransfer.setData('text/plain', key)
    e.dataTransfer.effectAllowed = 'move'
  }

  // Allow drag over only if not the "image" column
  const handleDragOver = (key: SortKey | 'image') => (e: React.DragEvent) => {
    if (key === 'image') return // cannot drop on "image" column
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  // Handle drop: update columnOrder state with new position
  const handleDrop = (key: SortKey) => (e: React.DragEvent) => {
    e.preventDefault()
    const from = dragCol.current
    if (!from || from === key) return // ignore invalid or same column
    setColumnOrder(prev => {
      const cols = prev.filter(c => c !== from) // remove dragged column
      const idx = cols.indexOf(key)             // find target index
      cols.splice(idx, 0, from)                 // insert dragged col before target
      return cols
    })
    dragCol.current = null
  }


  return (
    <div
      ref={viewportRef}
      onScroll={onScroll}
      style={{ maxHeight: 480 }} // fixed viewport max height
      className="overflow-auto border rounded"
    >
      <table className="min-w-full border-collapse">
        {/* -------- Table Header -------- */}
        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
          <tr>
            {columnOrder.map(col => {
              if (col === 'image') {
                // Special case: static image column (not sortable, not draggable)
                return (
                  <th
                    key="image"
                    className="p-4 text-left sticky left-0 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-200">Image</span>
                  </th>
                )
              }
              // Normal columns: sortable + draggable
              return (
                <th
                  key={col}
                  className="p-4 text-left cursor-pointer select-none relative group hover:bg-gray-200 dark:hover:bg-gray-700 border-b border-gray-300 dark:border-gray-700"
                  onClick={() => onSort(col)}                  // sort when clicked
                  draggable                                     // make draggable
                  onDragStart={handleDragStart(col)}
                  onDragOver={handleDragOver(col)}
                  onDrop={handleDrop(col)}
                >
                  {/* Column name */}
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </span>

                  {/* Sort icon (ascending/descending) */}
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {sortKey === col && (sortDir === 'asc' ? <Ascending /> : <Descending />)}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>

        {/* -------- Table Body -------- */}
        <tbody>
          {/* Case: No results */}
          {filteredLength === 0 && (
            <tr>
              <td colSpan={columnOrder.length} className="p-4 text-center text-sm">
                No results found.
              </td>
            </tr>
          )}

          {/* Case: Results available */}
          {filteredLength > 0 && (
            <>
              {/* Top spacer row (virtualization) */}
              {offsetY > 0 && (
                <tr style={{ height: offsetY }}>
                  <td colSpan={columnOrder.length} style={{ padding: 0, border: "none" }} />
                </tr>
              )}

              {/* Actual visible rows */}
              {visibleRows.map(row => (
                <tr key={row.id} style={{ height: rowHeight }}>
                  {columnOrder.map(col => {
                    if (col === 'image') {
                      // Special image column with thumbnail
                      return (
                        <td
                          key="image"
                          className="px-2 sticky left-0 bg-white dark:bg-gray-950"
                          style={{ width: 60, minWidth: 60, maxWidth: 60 }}
                        >
                          <img
                            src={row.image}
                            alt={row.name}
                            loading="lazy"
                            width={40}
                            height={40}
                            className="rounded"
                          />
                        </td>
                      )
                    }
                    // Normal text cells
                    return <td key={col} className="px-2">{String(row[col])}</td>
                  })}
                </tr>
              ))}

              {/* Bottom spacer row (virtualization) */}
              {totalHeight - offsetY - visibleRows.length * rowHeight > 0 && (
                <tr style={{ height: totalHeight - offsetY - visibleRows.length * rowHeight }}>
                  <td colSpan={columnOrder.length} style={{ padding: 0, border: "none" }} />
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}
