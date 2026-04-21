export type DataValue = string | number | null

export interface DataField {
  id: string
  key: string
  label: string
  shortLabel: string
  description?: string
  isNumeric?: boolean
  isDate?: boolean
}

export type DataRecord = Record<string, DataValue> & {
  id: string
}

export interface ReportFilters {
  brand: string
  location: string
  promotor: string
  dateFrom: string
  dateTo: string
}

export interface SummaryMetric {
  label: string
  value: string
  tone: 'default' | 'accent' | 'success'
}
