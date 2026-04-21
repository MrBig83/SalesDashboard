import { useMemo, useState } from 'react'

import { useDataContext } from '../../../hooks/useDataContext'
import { useReportContext } from '../../../hooks/useReportContext'
import type { SummaryMetric } from '../../../types/report'
import { formatCompactNumber, formatNumber } from '../../../utils/formatters'
import { applyReportFilters } from '../../../utils/reportFilters'
import { Reveal } from '../../common/Reveal/Reveal'
import { ReportDocument } from '../../report/ReportDocument/ReportDocument'
import { DashboardHero } from '../DashboardHero/DashboardHero'
import { DataTable } from '../DataTable/DataTable'
import { FieldSelector } from '../FieldSelector/FieldSelector'
import { FilterPanel } from '../FilterPanel/FilterPanel'
import { PerformanceChart } from '../PerformanceChart/PerformanceChart'
import { SharePanel } from '../SharePanel/SharePanel'
import { StatGrid } from '../StatGrid/StatGrid'
import './AdminDashboard.css'

const getNumericAverage = (values: (string | number | null)[]) => {
  const numericValues = values.filter((value): value is number => typeof value === 'number')

  if (numericValues.length === 0) {
    return 0
  }

  return numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
}

export const AdminDashboard = () => {
  const [includePdfRecords, setIncludePdfRecords] = useState(true)
  const {
    records,
    fields,
    brands,
    locations,
    promotors,
    isLoading,
    error,
  } = useDataContext()
  const {
    filters,
    selectedFieldIds,
    shareUrl,
    setFilter,
    toggleField,
    selectAllFields,
    clearAllFields,
    resetFilters,
    resetSelection,
  } = useReportContext()

  const filteredRecords = useMemo(
    () => applyReportFilters(records, filters),
    [records, filters],
  )

  const visibleFields = useMemo(
    () => fields.filter((field) => selectedFieldIds.includes(field.id)),
    [fields, selectedFieldIds],
  )

  const metrics = useMemo<SummaryMetric[]>(
    () => [
      { label: 'Poster i urval', value: formatNumber(filteredRecords.length), tone: 'default' },
      {
        label: 'Tastings totalt',
        value: formatCompactNumber(
          filteredRecords.reduce(
            (sum, record) => sum + (typeof record.tastings === 'number' ? record.tastings : 0),
            0,
          ),
        ),
        tone: 'accent',
      },
      {
        label: 'Köp totalt',
        value: formatCompactNumber(
          filteredRecords.reduce(
            (sum, record) => sum + (typeof record.purchases === 'number' ? record.purchases : 0),
            0,
          ),
        ),
        tone: 'success',
      },
      {
        label: 'Snittbetyg',
        value: formatNumber(
          filteredRecords.length === 0
            ? 0
            : getNumericAverage(filteredRecords.map((record) => record.sessionScore)),
        ),
        tone: 'default',
      },
    ],
    [filteredRecords],
  )

  const handleCopyShareUrl = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${shareUrl}`)
  }

  const handleExportPdf = () => {
    window.requestAnimationFrame(() => {
      const previousTitle = document.title
      document.title = 'Tasting report'
      window.print()
      document.title = previousTitle
    })
  }

  if (isLoading) {
    return <section className="admin-dashboard__state">Laddar rapportdata...</section>
  }

  if (error) {
    return <section className="admin-dashboard__state">{error}</section>
  }

  return (
    <div className="admin-dashboard">
      <DashboardHero />

      <Reveal>
        <StatGrid metrics={metrics} />
      </Reveal>

      <Reveal>
        <PerformanceChart records={filteredRecords} filters={filters} />
      </Reveal>

      <div className="admin-dashboard__columns">
        <Reveal className="admin-dashboard__column">
          <FilterPanel
            filters={filters}
            brands={brands}
            locations={locations}
            promotors={promotors}
            onFilterChange={setFilter}
            onResetFilters={resetFilters}
          />
        </Reveal>

        <Reveal className="admin-dashboard__column">
          <SharePanel
            shareUrl={`${window.location.origin}${shareUrl}`}
            includePdfRecords={includePdfRecords}
            onCopy={() => void handleCopyShareUrl()}
            onExportPdf={handleExportPdf}
            onIncludePdfRecordsChange={setIncludePdfRecords}
            onReset={resetSelection}
          />
        </Reveal>
      </div>

      <Reveal>
        <FieldSelector
          fields={fields}
          selectedFieldIds={selectedFieldIds}
          onToggleField={toggleField}
          onSelectAll={selectAllFields}
          onClearAll={clearAllFields}
        />
      </Reveal>

      <Reveal className="admin-dashboard__pdf-export">
        <ReportDocument
          title="Rapportförhandsvisning"
          subtitle="Det här dokumentet är samma strukturella bas som senare kan återanvändas för PDF-export."
          fields={visibleFields}
          records={filteredRecords}
          filters={filters}
          showRecords={includePdfRecords}
        />
      </Reveal>

      <Reveal>
        <DataTable fields={visibleFields} records={filteredRecords} />
      </Reveal>
    </div>
  )
}
