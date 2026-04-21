import { HashRouter, Route, Routes } from 'react-router-dom'

import { AdminDashboard } from './components/dashboard/AdminDashboard/AdminDashboard'
import { AppShell } from './components/layout/AppShell/AppShell'
import { PublicReport } from './components/report/PublicReport/PublicReport'
import { DataProvider } from './contexts/DataContext'
import { ReportProvider } from './contexts/ReportContext'

const App = () => (
  <HashRouter>
    <DataProvider>
      <ReportProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/report" element={<PublicReport />} />
            <Route path="/report/:shareCode" element={<PublicReport />} />
            <Route path="*" element={<AdminDashboard />} />
          </Routes>
        </AppShell>
      </ReportProvider>
    </DataProvider>
  </HashRouter>
)

export default App
