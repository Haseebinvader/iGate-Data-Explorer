import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import type { RoutesProps } from '../lib/Interface'
import { DataTableExplorer } from './DataTableExplorer'

// Lazy load pages
const Stats = lazy(() => import('../pages/Stats'))
const AnalysisWizard = lazy(() => import('../pages/AnalysisWizard'))

const AppRoutes = ({ data, isLoading }: RoutesProps) => {
    return (
        <Suspense fallback={<div className="p-6">Loading page...</div>}>
            <Routes>
                <Route path="/" element={<DataTableExplorer rows={data ?? []} isLoading={isLoading} />} /> 
                <Route path="/stats" element={<Stats />} />
                <Route path="/wizard" element={<AnalysisWizard />} />
            </Routes>
        </Suspense>
    )
}

export default AppRoutes
