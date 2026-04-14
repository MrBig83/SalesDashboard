import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import logo from '../../../assets/brand/logo.png'
import { useDataContext } from '../../../hooks/useDataContext'
import { applyReportFilters } from '../../../utils/reportFilters'
import {
  parseFieldIdsFromUrl,
  parseReportFiltersFromUrl,
} from '../../../utils/reportUrl'
import { Reveal } from '../../common/Reveal/Reveal'
import { ReportCharts } from '../ReportCharts/ReportCharts'
import { ReportDocument } from '../ReportDocument/ReportDocument'
import './PublicReport.css'

export const PublicReport = () => {
  const { records, fields, isLoading, error } = useDataContext()
  const location = useLocation()

  const filters = useMemo(
    () => parseReportFiltersFromUrl(location.search),
    [location.search],
  )
  const selectedFieldIds = useMemo(
    () => parseFieldIdsFromUrl(new URLSearchParams(location.search).get('fields')),
    [location.search],
  )

  const visibleFields = useMemo(() => {
    if (selectedFieldIds.length === 0) {
      return fields
    }

    return fields.filter((field) => selectedFieldIds.includes(field.id))
  }, [fields, selectedFieldIds])

  const filteredRecords = useMemo(
    () => applyReportFilters(records, filters),
    [records, filters],
  )

  if (isLoading) {
    return <section className="public-report">Laddar publik rapport...</section>
  }

  if (error) {
    return <section className="public-report">{error}</section>
  }

  return (
    <div className="public-report">
      <header className="public-report__header">
        <div className="public-report__brand">
          <img src={logo} alt="Brand logo" className="public-report__logo" />
          <div className="public-report__brand-copy">
            <span>Shared report</span>
            <h1>Tasting report viewer</h1>
          </div>
        </div>
        <p>
          Rapporten är filtrerad efter valda parametrar och visar endast de fält
          som delades i länken.
        </p>
      </header>
      <Reveal>
        <ReportCharts records={filteredRecords} />
      </Reveal>
      <Reveal>
        <ReportDocument
          title="Delad rapport"
          subtitle="Read-only-vy för mottagare som öppnar din dynamiska rapportlänk."
          fields={visibleFields}
          records={filteredRecords}
          filters={filters}
          variant="shared"
        />
      </Reveal>
    </div>
  )
}
