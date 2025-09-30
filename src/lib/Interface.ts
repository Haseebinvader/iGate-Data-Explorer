import type { RecordItem } from "../hooks/useDataset"
import type { RecordSortKey } from "../hooks/useRecordFilters"

export interface HeaderProps {
  data: RecordItem[]
  mode: string
}

export interface DataTableProps {
  rows: RecordItem[]
}

export interface DataTableResourceWarningProps {
  tracker: {
    warning?: string
    memoryMB?: number
  }
}

export interface DataTableFiltersProps {
  query: string
  setQuery: (q: string) => void
  category: string
  setCategory: (c: string) => void
  categories: string[]
  resultCount: number
}

export interface DataTablePaginationProps {
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  pageSize: number
  setPageSize: (n: number) => void
  totalPages: number
}

export interface RoutesProps {
  data: RecordItem[]
  isLoading: boolean

}

export type SortKey = RecordSortKey

// Props that ErrorBoundary accepts
export type ErrorBoundaryProps = {
  // Optional fallback UI to render when an error occurs
  fallback?: React.ReactNode
  // Callback when an error is caught
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  // Callback when retry button is clicked
  onRetry?: () => void
}

// State managed by ErrorBoundary
export type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

