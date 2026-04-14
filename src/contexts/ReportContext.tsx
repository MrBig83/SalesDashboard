import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { defaultSelectedFieldIds } from '../constants/columnConfig'
import type { ReportDeliveryMode, ReportFilters } from '../types/report'
import { defaultReportFilters } from '../utils/reportFilters'
import {
  buildReportUrl,
  buildSharedReportUrl,
  parseFieldIdsFromUrl,
  parseReportFiltersFromUrl,
} from '../utils/reportUrl'
import { upsertSharedReport } from '../utils/sharedReportStore'

interface ReportContextValue {
  filters: ReportFilters
  selectedFieldIds: string[]
  deliveryMode: ReportDeliveryMode
  shareCode: string
  shareUrl: string
  setFilter: <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => void
  toggleField: (fieldId: string) => void
  selectAllFields: (fieldIds: string[]) => void
  clearAllFields: () => void
  setDeliveryMode: (mode: ReportDeliveryMode) => void
  resetFilters: () => void
  resetSelection: () => void
}

export const ReportContext = createContext<ReportContextValue | null>(null)

export const ReportProvider = ({ children }: PropsWithChildren) => {
  const [filters, setFilters] = useState<ReportFilters>(defaultReportFilters)
  const [selectedFieldIds, setSelectedFieldIds] = useState(defaultSelectedFieldIds)
  const [deliveryMode, setDeliveryMode] = useState<ReportDeliveryMode>('link')
  const [shareCode, setShareCode] = useState('')

  useEffect(() => {
    setFilters(parseReportFiltersFromUrl(window.location.search))

    const nextFields = parseFieldIdsFromUrl(
      new URLSearchParams(window.location.search).get('fields'),
    )

    if (nextFields.length > 0) {
      setSelectedFieldIds(nextFields)
    }
  }, [])

  const setFilter = <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }))
  }

  const toggleField = (fieldId: string) => {
    setSelectedFieldIds((currentFields) => {
      if (currentFields.includes(fieldId)) {
        if (currentFields.length === 1) {
          return currentFields
        }

        return currentFields.filter((currentField) => currentField !== fieldId)
      }

      return [...currentFields, fieldId]
    })
  }

  const selectAllFields = (fieldIds: string[]) => {
    setSelectedFieldIds(fieldIds)
  }

  const clearAllFields = () => {
    setSelectedFieldIds([])
  }

  const resetFilters = () => {
    setFilters(defaultReportFilters)
  }

  const resetSelection = () => {
    setFilters(defaultReportFilters)
    setSelectedFieldIds(defaultSelectedFieldIds)
    setDeliveryMode('link')
  }

  useEffect(() => {
    const sharedReport = upsertSharedReport(
      shareCode || null,
      filters,
      selectedFieldIds,
    )

    if (sharedReport.code !== shareCode) {
      setShareCode(sharedReport.code)
    }
  }, [filters, selectedFieldIds, shareCode])

  const shareUrl = useMemo(() => {
    if (!shareCode) {
      return buildReportUrl(filters, selectedFieldIds)
    }

    return buildSharedReportUrl(shareCode)
  }, [filters, selectedFieldIds, shareCode])

  useEffect(() => {
    if (window.location.pathname !== '/') {
      return
    }

    const params = new URLSearchParams()

    if (filters.brand !== defaultReportFilters.brand) {
      params.set('brand', filters.brand)
    }

    if (filters.location !== defaultReportFilters.location) {
      params.set('location', filters.location)
    }

    if (filters.promotor !== defaultReportFilters.promotor) {
      params.set('promotor', filters.promotor)
    }

    if (filters.dateFrom) {
      params.set('dateFrom', filters.dateFrom)
    }

    if (filters.dateTo) {
      params.set('dateTo', filters.dateTo)
    }

    if (selectedFieldIds.length > 0) {
      params.set('fields', selectedFieldIds.join(','))
    }

    const query = params.toString()
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}`
    window.history.replaceState({}, '', nextUrl)
  }, [filters, selectedFieldIds])

  const value = useMemo(
    () => ({
      filters,
      selectedFieldIds,
      deliveryMode,
      shareCode,
      shareUrl,
      setFilter,
      toggleField,
      selectAllFields,
      clearAllFields,
      setDeliveryMode,
      resetFilters,
      resetSelection,
    }),
    [deliveryMode, filters, selectedFieldIds, shareCode, shareUrl],
  )

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
}
