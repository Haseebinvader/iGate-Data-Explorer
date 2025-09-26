import React, { useRef, useEffect } from 'react'
import { Ascending, Descending } from './IoncsSvg'
import { type RecordSortKey } from '../hooks/useRecordFilters'
import { type RecordItem } from '../hooks/useDataset'

type SortKey = RecordSortKey

interface DataTableTableProps {
  columnOrder: Array<SortKey | 'image'>
  setColumnOrder: React.Dispatch<React.SetStateAction<Array<SortKey | 'image'>>>
  sortKey: SortKey
  sortDir: 'asc' | 'desc'
  onSort: (key: SortKey) => void
  pageRows: RecordItem[]
  rowHeight: number
  viewportRef: React.RefObject<HTMLDivElement | null>;
  scrollTop: number
  setScrollTop: (n: number) => void
  viewportHeight: number
  setViewportHeight: (n: number) => void
  filteredLength: number
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
  // Virtualization calculations
  const totalHeight = pageRows.length * rowHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 5)
  const endIndex = Math.min(pageRows.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + 5)
  const visibleRows = pageRows.slice(startIndex, endIndex)
  const offsetY = startIndex * rowHeight

  // Track viewport height dynamically (resizing container)
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setViewportHeight(el.clientHeight))
    ro.observe(el)
    setViewportHeight(el.clientHeight)
    return () => ro.disconnect()
  }, [viewportRef, setViewportHeight])

  // Handle scroll position for virtualization
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  // Column Drag & Drop for reordering
  const dragCol = useRef<SortKey | null>(null)

  const handleDragStart = (key: SortKey) => (e: React.DragEvent) => {
    dragCol.current = key
    e.dataTransfer.setData('text/plain', key)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (key: SortKey | 'image') => (e: React.DragEvent) => {
    if (key === 'image') return
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
      cols.splice(idx, 0, from)
      return cols
    })
    dragCol.current = null
  }

  return (
    <div
      ref={viewportRef}
      onScroll={onScroll}
      style={{ maxHeight: 480 }}
      className="overflow-auto border rounded"
    >
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
          <tr>
            {columnOrder.map(col => {
              if (col === 'image') {
                return (
                  <th
                    key="image"
                    className="p-4 text-left sticky left-0 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-200">Image</span>
                  </th>
                )
              }
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
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {sortKey === col && (sortDir === 'asc' ? <Ascending /> : <Descending />)}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {filteredLength === 0 && (
            <tr>
              <td colSpan={columnOrder.length} className="p-4 text-center text-sm">No results found.</td>
            </tr>
          )}
          {filteredLength > 0 && (
            <>
              {offsetY > 0 && (
                <tr style={{ height: offsetY }}>
                  <td colSpan={columnOrder.length} style={{ padding: 0, border: "none" }} />
                </tr>
              )}
              {visibleRows.map(row => (
                <tr key={row.id} style={{ height: rowHeight }}>
                  {columnOrder.map(col => {
                    if (col === 'image') {
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
                    return <td key={col} className="px-2">{String(row[col])}</td>
                  })}
                </tr>
              ))}
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