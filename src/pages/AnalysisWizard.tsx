import { useSearchParams } from 'react-router-dom'
import { useDataset } from '../hooks/useDataset'
import ReactECharts from 'echarts-for-react'
import { useRecordFilters } from '../hooks/useRecordFilters'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'  // Import the toast function

export default function AnalysisWizard() {
  const [params, setParams] = useSearchParams()

  // Current wizard step (default 1)
  const step = Number(params.get('step') || 1)

  // Read filters from URL params
  const queryParam = params.get('searchedQuery') || ''
  const categoryParam = params.get('category') || ''

  // Helper to update the "step" param in URL
  const setStep = (n: number) =>
    setParams(prev => {
      const p = new URLSearchParams(prev)
      p.set('step', String(n))
      return p
    })

  // Load dataset via React Query
  const { data } = useDataset()

  // Custom filtering hook: manages query string, categories, filtered records
  const {
    query, setQuery,
    category, setCategory,
    categories, filtered,
  } = useRecordFilters(data ?? [])

  // Sync the query and category from URL params
  useEffect(() => {
    setQuery(queryParam)
    setCategory(categoryParam)
  }, [queryParam, categoryParam, setQuery, setCategory])

  // Step navigation handlers
 const next = () => {
    // Show toast when moving to the next step
     toast.success(`Filters wizard applied successfully!`, {
    position: "bottom-right", // Position of the toast
    duration: 3000, // Automatically close after 3 seconds
    style: {
      background: '#4caf50',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '8px',
      padding: '12px',
    },
  });
    setStep(Math.min(3, step + 1)) // max step = 3
  }
  const prev = () => setStep(Math.max(1, step - 1)) // min step = 1

  // Apply the filters when navigating to Step 2
  useEffect(() => {
    if (step === 1) {
      // Update URL params with the current query & category on Step 1
      setParams(p => {
        const np = new URLSearchParams(p)
        np.set('searchedQuery', query)
        np.set('category', category)
        return np
      })
    }
  }, [query, category, step, setParams])

  return (
    <div className="p-4 space-y-4">
      {/* Wizard Title */}
      <h2 className="text-xl font-semibold">Analysis Wizard</h2>

      {/* Step indicators */}
      <div className="flex items-center gap-2 text-sm">
        <span className={step === 1 ? "font-bold" : ""}>1. Filters</span>
        <span>→</span>
        <span className={step === 2 ? "font-bold" : ""}>2. Preview</span>
        <span>→</span>
        <span className={step === 3 ? "font-bold" : ""}>3. Chart</span>
      </div>

      {/* ------------------- STEP 1: FILTERS ------------------- */}
      {step === 1 && (
        <div className="space-y-3">
          {/* Search input + category dropdown */}
          <div className="flex gap-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search..."
              className="px-3 py-2 border rounded"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="">All categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Apply filters and go next */}
          <button
            className="px-3 py-1.5 rounded bg-blue-600 text-white"
            onClick={() => {
              // Save query & category to URL params
              setParams(p => {
                const np = new URLSearchParams(p)
                np.set('searchedQuery', query)
                np.set('category', category)
                return np
              })
              next()
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* ------------------- STEP 2: PREVIEW ------------------- */}
      {step === 2 && (
        <div className="space-y-3">
          <div className="text-sm">Rows: {filtered.length}</div>

          {/* Preview filtered table (up to 200 rows) */}
          <div className="border rounded overflow-auto" style={{ maxHeight: 300 }}>
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Year</th>
                  <th className="p-2 text-left">Rating</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.category}</td>
                    <td className="p-2">{r.year}</td>
                    <td className="p-2">{r.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded border" onClick={prev}>Back</button>
            <button className="px-3 py-1.5 rounded bg-blue-600 text-white" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {/* ------------------- STEP 3: CHART ------------------- */}
      {step === 3 && (
        <div className="space-y-3">
          <div className="text-sm opacity-70">Generating chart from filtered data</div>

          {/* Simple bar chart of first 20 filtered records */}
          <ReactECharts
            option={{
              xAxis: { type: 'category', data: filtered.slice(0, 20).map(r => r.name) },
              yAxis: { type: 'value' },
              series: [{ type: 'bar', data: filtered.slice(0, 20).map(r => r.rating) }],
            }}
            style={{ height: 320 }}
          />

          {/* Navigation back button */}
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded border" onClick={prev}>Back</button>
          </div>
        </div>
      )}
    </div>
  )
}
