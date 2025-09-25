import { OfflineBanner } from './components/OfflineBanner'
import { useAppSelector } from './store'
import { useDataset } from './hooks/useDataset'
import { useState } from 'react'
import { FilterChips } from './components/FilterChips'
import { BackToTop } from './components/BackToTop'
import Header from './components/Header'
import AppRoutes from './components/Routes'

function App() {
  const mode = useAppSelector(s => s.theme.mode)
  const { data } = useDataset()
  const [activeChips, setActiveChips] = useState<string[]>([])

  return (
    <>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <OfflineBanner />
        <Header data={data || []} mode={mode} />
        <main className="p-4 space-y-3">
          <FilterChips chips={activeChips} onClear={(c) => setActiveChips(activeChips.filter(x => x !== c))} />
          <AppRoutes data={data || []} />
        </main>
        <BackToTop />
      </div>
    </>
  )
}

export default App
