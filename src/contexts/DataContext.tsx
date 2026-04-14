import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react'

import workbookUrl from '../../Data/NAN Tasting Report (Svar).xlsx?url'
import { reportFields } from '../constants/columnConfig'
import type { DataField, DataRecord } from '../types/report'
import { getDistinctStringValues } from '../utils/reportFilters'
import { parseWorkbook } from '../utils/workbookParser'

interface DataContextValue {
  records: DataRecord[]
  fields: DataField[]
  brands: string[]
  locations: string[]
  promotors: string[]
  isLoading: boolean
  error: string | null
}

export const DataContext = createContext<DataContextValue | null>(null)

export const DataProvider = ({ children }: PropsWithChildren) => {
  const [records, setRecords] = useState<DataRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadWorkbook = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(workbookUrl)

        if (!response.ok) {
          throw new Error('Kunde inte läsa in Excel-filen.')
        }

        const buffer = await response.arrayBuffer()
        setRecords(parseWorkbook(buffer))
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Något gick fel vid inläsning av data.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadWorkbook()
  }, [])

  const brands = useMemo(() => getDistinctStringValues(records, 'brand'), [records])
  const locations = useMemo(() => getDistinctStringValues(records, 'location'), [records])
  const promotors = useMemo(() => getDistinctStringValues(records, 'promotorName'), [records])

  const value = useMemo(
    () => ({
      records,
      fields: reportFields,
      brands,
      locations,
      promotors,
      isLoading,
      error,
    }),
    [brands, error, isLoading, locations, promotors, records],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
