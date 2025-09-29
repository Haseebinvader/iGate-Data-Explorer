import { Link } from 'react-router-dom'
import { useAppDispatch } from '../store'
import { exportCSV, exportJSON } from '../lib/exports'
import { toggleTheme } from '../store/slices/themeSlice'
import type { HeaderProps } from '../lib/Interface'

/**
 * --------------------------------
 * Header Component
 * --------------------------------
 * Displays the top navigation bar:
 * - App title & navigation links
 * - Theme toggle (light/dark)
 * - Export buttons (CSV / JSON)
 *
 * Props:
 * - data: current filtered dataset (optional, used for export)
 * - mode: current theme mode ("light" | "dark")
 */
const Header = ({ data, mode }: HeaderProps) => {
  const dispatch = useAppDispatch() // Redux dispatch hook

  return (
    <header className="p-4 flex items-center gap-4 justify-between border-b border-gray-200 dark:border-gray-800">
      {/* --------------------------------
          Left Section: Title + Navigation
      -------------------------------- */}
      <div className="flex items-center gap-4">
        {/* App title */}
        <h1 className="text-2xl font-bold">Data Explorer</h1>

        {/* Navigation links */}
        <nav className="flex gap-3 text-sm">
          <Link className="underline" to="/">Table</Link>
          <Link className="underline" to="/stats">Stats</Link>
          <Link className="underline" to="/wizard">Wizard</Link>
        </nav>
      </div>

      {/* --------------------------------
          Right Section: Controls
          - Theme toggle
          - Export CSV/JSON
      -------------------------------- */}
      <div className="flex items-center gap-2">
        {/* Theme toggle button */}
        <button
          className="px-3 py-1.5 rounded bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900"
          onClick={() => dispatch(toggleTheme())}
        >
          Toggle {mode === 'light' ? 'Dark' : 'Light'}
        </button>

        {/* Export to CSV */}
        <button
          className="px-3 py-1.5 rounded border"
          onClick={() => exportCSV(data ?? [], 'filtered.csv')}
        >
          Export CSV
        </button>

        {/* Export to JSON */}
        <button
          className="px-3 py-1.5 rounded border"
          onClick={() => exportJSON(data ?? [], 'filtered.json')}
        >
          Export JSON
        </button>
      </div>
    </header>
  )
}

export default Header
