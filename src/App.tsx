import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AdminDashboard } from './components/dashboard/AdminDashboard/AdminDashboard'
import { AppShell } from './components/layout/AppShell/AppShell'
import { PublicReport } from './components/report/PublicReport/PublicReport'
import { DataProvider } from './contexts/DataContext'
import { ReportProvider } from './contexts/ReportContext'

const App = () => (
  <BrowserRouter>
    <DataProvider>
      <ReportProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/report" element={<PublicReport />} />
          </Routes>
        </AppShell>
      </ReportProvider>
    </DataProvider>
  </BrowserRouter>
)

export default App
