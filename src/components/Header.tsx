import { Link } from 'react-router-dom'
import { useAppDispatch } from '../store'
import { exportCSV, exportJSON } from '../lib/exports'
import { toggleTheme } from '../store/slices/themeSlice'
import type { RecordItem } from '../hooks/useDataset'

const Header = ({data, mode}: {data: RecordItem[], mode: string}) => {
  const dispatch = useAppDispatch()

  return (
    <header className="p-4 flex items-center gap-4 justify-between border-b border-gray-200 dark:border-gray-800">
    <div className="flex items-center gap-4">
      <h1 className="text-2xl font-bold">Data Explorer</h1>
      <nav className="flex gap-3 text-sm">
        <Link className="underline" to="/">Table</Link>
        <Link className="underline" to="/stats">Stats</Link>
        <Link className="underline" to="/wizard">Wizard</Link>
      </nav>
    </div>
    <div className="flex items-center gap-2">
      <button
        className="px-3 py-1.5 rounded bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900"
        onClick={() => dispatch(toggleTheme())}
      >
        Toggle {mode === 'light' ? 'Dark' : 'Light'}
      </button>
      <button className="px-3 py-1.5 rounded border" onClick={() => exportCSV(data ?? [], 'filtered.csv')}>Export CSV</button>
      <button className="px-3 py-1.5 rounded border" onClick={() => exportJSON(data ?? [], 'filtered.json')}>Export JSON</button>
    </div>
  </header>
  )
}

export default Header