import type { DataTableResourceWarningProps } from "../lib/Interface"

export function DataTableResourceWarning({ tracker }: DataTableResourceWarningProps) {
  if (!tracker.warning) return null
  return (
    <div className="text-xs text-amber-700 dark:text-amber-400">
      {tracker.warning} {tracker.memoryMB ? `(~${tracker.memoryMB} MB)` : ''}
    </div>
  )
}