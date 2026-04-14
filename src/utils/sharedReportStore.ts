import type { ReportFilters } from '../types/report'
import type { SharedReportConfig } from '../types/sharedReport'

const STORAGE_KEY = 'salesDashboard.sharedReports.v1'
const CODE_LENGTH = 8
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

interface SharedReportPayload {
  reports: SharedReportConfig[]
  lastUpdated: string
}

const emptyPayload = (): SharedReportPayload => ({
  reports: [],
  lastUpdated: new Date().toISOString(),
})

const readPayload = (): SharedReportPayload => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return emptyPayload()
    }

    const parsed = JSON.parse(raw) as SharedReportPayload

    if (!Array.isArray(parsed.reports)) {
      return emptyPayload()
    }

    return parsed
  } catch {
    return emptyPayload()
  }
}

const savePayload = (payload: SharedReportPayload) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

const generateCode = (existingCodes: Set<string>) => {
  let nextCode = ''

  do {
    nextCode = Array.from(
      { length: CODE_LENGTH },
      () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)],
    ).join('')
  } while (existingCodes.has(nextCode))

  return nextCode
}

export const upsertSharedReport = (
  currentCode: string | null,
  filters: ReportFilters,
  selectedFieldIds: string[],
) => {
  const payload = readPayload()
  const existingCodes = new Set(payload.reports.map((report) => report.code))
  const now = new Date().toISOString()
  const nextCode = currentCode && currentCode.trim().length > 0
    ? currentCode.toUpperCase()
    : generateCode(existingCodes)

  const existingReport = payload.reports.find((report) => report.code === nextCode)
  const nextReport: SharedReportConfig = {
    code: nextCode,
    filters,
    selectedFieldIds,
    createdAt: existingReport?.createdAt ?? now,
    updatedAt: now,
  }

  const existingIndex = payload.reports.findIndex((report) => report.code === nextCode)

  if (existingIndex >= 0) {
    payload.reports[existingIndex] = nextReport
  } else {
    payload.reports.push(nextReport)
  }

  payload.lastUpdated = now
  savePayload(payload)

  return nextReport
}

export const getSharedReportByCode = (code: string) => {
  const normalizedCode = code.trim().toUpperCase()

  if (!normalizedCode) {
    return null
  }

  const payload = readPayload()
  return payload.reports.find((report) => report.code === normalizedCode) ?? null
}
