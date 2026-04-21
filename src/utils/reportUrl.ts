import type { ReportFilters } from '../types/report'
import { allFilterValue, defaultReportFilters } from './reportFilters'

export const reportRoute = '/report'

const getAppPath = () => {
  const pathname = window.location.pathname

  if (pathname.endsWith('/')) {
    return pathname
  }

  return pathname.includes('.') ? pathname.replace(/\/[^/]*$/, '/') : `${pathname}/`
}

export const buildSharedReportUrl = (code: string) =>
  `${getAppPath()}#${reportRoute}/${encodeURIComponent(code)}`

export const buildReportUrl = (filters: ReportFilters, selectedFields: string[]) => {
  const params = new URLSearchParams()

  if (filters.brand && filters.brand !== allFilterValue) {
    params.set('brand', filters.brand)
  }

  if (filters.location && filters.location !== allFilterValue) {
    params.set('location', filters.location)
  }

  if (filters.promotor && filters.promotor !== allFilterValue) {
    params.set('promotor', filters.promotor)
  }

  if (filters.dateFrom) {
    params.set('dateFrom', filters.dateFrom)
  }

  if (filters.dateTo) {
    params.set('dateTo', filters.dateTo)
  }

  if (selectedFields.length > 0) {
    params.set('fields', selectedFields.join(','))
  }

  const query = params.toString()
  return `${getAppPath()}#${reportRoute}${query ? `?${query}` : ''}`
}

export const parseFieldIdsFromUrl = (value: string | null) =>
  value?.split(',').map((field) => field.trim()).filter(Boolean) ?? []

export const parseReportFiltersFromUrl = (search: string): ReportFilters => {
  const params = new URLSearchParams(search)

  return {
    brand: params.get('brand') ?? defaultReportFilters.brand,
    location: params.get('location') ?? defaultReportFilters.location,
    promotor: params.get('promotor') ?? defaultReportFilters.promotor,
    dateFrom: params.get('dateFrom') ?? defaultReportFilters.dateFrom,
    dateTo: params.get('dateTo') ?? defaultReportFilters.dateTo,
  }
}
