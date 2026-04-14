import * as XLSX from 'xlsx'

import { reportFields } from '../constants/columnConfig'
import type { DataRecord, DataValue } from '../types/report'
import { fromExcelSerialDate, toSentenceCase } from './formatters'

const findFieldDefinition = (key: string) => reportFields.find((field) => field.key === key)

const normalizeCellValue = (key: string, value: unknown): DataValue => {
  if (value === '' || value === undefined || value === null) {
    return null
  }

  const field = findFieldDefinition(key)

  if (field?.isDate && typeof value === 'number') {
    return fromExcelSerialDate(value)
  }

  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    return toSentenceCase(value)
  }

  return String(value)
}

export const parseWorkbook = (arrayBuffer: ArrayBuffer): DataRecord[] => {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: null })

  return rows.map((row, index) =>
    reportFields.reduce<DataRecord>(
      (record, field) => {
        record[field.id] = normalizeCellValue(field.key, row[field.key])
        return record
      },
      { id: `row-${index + 1}` },
    ),
  )
}
