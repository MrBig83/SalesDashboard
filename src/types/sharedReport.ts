import type { ReportFilters } from './report'

export interface SharedReportConfig {
  code: string
  filters: ReportFilters
  selectedFieldIds: string[]
  createdAt: string
  updatedAt: string
}
