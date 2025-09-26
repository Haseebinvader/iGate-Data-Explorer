import type { DataTablePaginationProps } from "../lib/Interface";

export function DataTablePagination({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalPages,
}: DataTablePaginationProps) {
  return (
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
  )
}