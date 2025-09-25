import { useOnlineStatus } from "../hooks/useOnlineStatus"

export function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null
  return (
    <div className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100 text-center py-2 text-sm">
      Offline – showing cached results.
    </div>
  )
}

