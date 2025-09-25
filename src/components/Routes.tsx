import { Routes, Route } from 'react-router-dom'
import { DataTable } from './DataTable'
import StatsPage from '../pages/Stats'
import AnalysisWizard from '../pages/AnalysisWizard'
import type { RecordItem } from '../hooks/useDataset'

const AppRoutes = ({ data }: { data: RecordItem[] }) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<DataTable rows={data ?? []} />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/wizard" element={<AnalysisWizard />} />
            </Routes>
        </>
    )
}

export default AppRoutes