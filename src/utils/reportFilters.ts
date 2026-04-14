import type { DataRecord, ReportFilters } from '../types/report'

export const allFilterValue = 'ALL'

export const defaultReportFilters: ReportFilters = {
  brand: allFilterValue,
  location: allFilterValue,
  promotor: allFilterValue,
  dateFrom: '',
  dateTo: '',
}

const toTimestamp = (value: string | number | null) => {
  if (!value) {
    return null
  }

  const timestamp = new Date(typeof value === 'number' ? value : value).getTime()
  return Number.isNaN(timestamp) ? null : timestamp
}

export const applyReportFilters = (
  records: DataRecord[],
  filters: ReportFilters,
) =>
  records.filter((record) => {
    if (filters.brand !== allFilterValue && record.brand !== filters.brand) {
      return false
    }

    if (filters.location !== allFilterValue && record.location !== filters.location) {
      return false
    }

    if (filters.promotor !== allFilterValue && record.promotorName !== filters.promotor) {
      return false
    }

    const activationTime = toTimestamp(record.activationDate)

    if (filters.dateFrom) {
      const startTime = new Date(filters.dateFrom).getTime()
      if (activationTime === null || activationTime < startTime) {
        return false
      }
    }

    if (filters.dateTo) {
      const endDate = new Date(filters.dateTo)
      endDate.setHours(23, 59, 59, 999)
      if (activationTime === null || activationTime > endDate.getTime()) {
        return false
      }
    }

    return true
  })

export const getDistinctStringValues = (
  records: DataRecord[],
  key: keyof DataRecord,
) =>
  [...new Set(records
    .map((record) => record[key])
    .filter((value): value is string => typeof value === 'string' && value.length > 0))]
    .sort((left, right) => left.localeCompare(right, 'sv'))
