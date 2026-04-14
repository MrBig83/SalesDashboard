import { useContext } from 'react'

import { ReportContext } from '../contexts/ReportContext'

export const useReportContext = () => {
  const context = useContext(ReportContext)

  if (!context) {
    throw new Error('useReportContext must be used inside ReportProvider')
  }

  return context
}
