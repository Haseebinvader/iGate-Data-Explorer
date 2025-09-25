import ReactECharts from 'echarts-for-react'
import { useAppSelector } from '../store'
import { useDataset } from '../hooks/useDataset'
import { useMemo } from 'react'
import { makeYearOption, makeAvgOption } from '../lib/statsConfiguration'

export default function StatsPage() {
  // Get current theme mode from Redux store
  const mode = useAppSelector(s => s.theme.mode)

  // Load dataset from custom hook
  const { data } = useDataset()

  // Flag for dark mode (used in charts & styles)
  const isDark = mode === 'dark'

  /**
   * Build year distribution data
   * Example: [[2020, 5], [2021, 8], ...]
   */
  const yearDist = useMemo(() => {
    const map = new Map<number, number>()
    for (const r of data ?? []) {
      // Count how many records per year
      map.set(r.year, (map.get(r.year) ?? 0) + 1)
    }
    // Convert Map -> Array and sort ascending by year
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0])
  }, [data])

  /**
   * Build average rating per category
   * Example: [{ category: "Action", avg: 4.2 }, { category: "Drama", avg: 3.8 }]
   */
  const avgByCategory = useMemo(() => {
    const acc = new Map<string, { sum: number; count: number }>()
    for (const r of data ?? []) {
      // Accumulate sum & count for each category
      const a = acc.get(r.category) ?? { sum: 0, count: 0 }
      a.sum += r.rating
      a.count += 1
      acc.set(r.category, a)
    }
    // Compute average = sum / count
    return Array.from(acc.entries()).map(([k, v]) => ({
      category: k,
      avg: v.sum / v.count || 0,
    }))
  }, [data])

  return (
    <div className="p-4 space-y-6">
      {/* Page Title */}
      <h2 className="text-xl font-semibold">Statistics</h2>

      {/* Two charts side-by-side (responsive grid) */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Chart 1: Distribution by Year */}
        <div className="border rounded-lg p-3 shadow-sm dark:border-gray-800">
          <ReactECharts
            option={makeYearOption({ yearDist, isDark })}
            theme={isDark ? 'dark' : undefined}
            style={{ height: 340 }}
          />
        </div>

        {/* Chart 2: Average Rating by Category */}
        <div className="border rounded-lg p-3 shadow-sm dark:border-gray-800">
          <ReactECharts
            option={makeAvgOption({ avgByCategory, isDark })}
            theme={isDark ? 'dark' : undefined}
            style={{ height: 340 }}
          />
        </div>
      </div>
    </div>
  )
}
