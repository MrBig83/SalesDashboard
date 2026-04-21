import logo from '../../../assets/brand/logo.png'
import type { DataField, DataRecord, ReportFilters } from '../../../types/report'
import { formatDate, formatNumber } from '../../../utils/formatters'
import { allFilterValue } from '../../../utils/reportFilters'
import './ReportDocument.css'

interface ReportDocumentProps {
  title: string
  subtitle: string
  fields: DataField[]
  records: DataRecord[]
  filters: ReportFilters
  showRecords?: boolean
  variant?: 'dashboard' | 'shared'
}

const renderValue = (field: DataField, value: DataRecord[string]) => {
  if (value === null) {
    return '-'
  }

  if (field.isDate) {
    return formatDate(value)
  }

  if (field.isNumeric && typeof value === 'number') {
    return formatNumber(value)
  }

  return String(value)
}

const buildFilterChips = (filters: ReportFilters) => {
  const chips: string[] = []

  if (filters.brand !== allFilterValue) {
    chips.push(`Brand: ${filters.brand}`)
  }

  if (filters.location !== allFilterValue) {
    chips.push(`Plats: ${filters.location}`)
  }

  if (filters.promotor !== allFilterValue) {
    chips.push(`Promotor: ${filters.promotor}`)
  }

  if (filters.dateFrom) {
    chips.push(`Från: ${formatDate(filters.dateFrom)}`)
  }

  if (filters.dateTo) {
    chips.push(`Till: ${formatDate(filters.dateTo)}`)
  }

  return chips.length > 0 ? chips : ['Inga extra filter valda']
}

export const ReportDocument = ({
  title,
  subtitle,
  fields,
  records,
  filters,
  showRecords = true,
  variant = 'dashboard',
}: ReportDocumentProps) => {
  const totalPurchases = records.reduce(
    (sum, record) => sum + (typeof record.purchases === 'number' ? record.purchases : 0),
    0,
  )
  const totalTastings = records.reduce(
    (sum, record) => sum + (typeof record.tastings === 'number' ? record.tastings : 0),
    0,
  )

  return (
    <section className={`report-document report-document--${variant}`}>
      <header className="report-document__header">
        <div className="report-document__brand-row">
          <img src={logo} alt="Brand logo" className="report-document__logo" />
          <div className="report-document__title-block">
            <span className="report-document__eyebrow">Rapportdokument</span>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
        </div>
        <div className="report-document__summary">
          <div>
            <span>Poster</span>
            <strong>{formatNumber(records.length)}</strong>
          </div>
          <div>
            <span>Tastings</span>
            <strong>{formatNumber(totalTastings)}</strong>
          </div>
          <div>
            <span>Köp</span>
            <strong>{formatNumber(totalPurchases)}</strong>
          </div>
        </div>
      </header>

      <div className="report-document__chips">
        {buildFilterChips(filters).map((chip) => (
          <span key={chip}>{chip}</span>
        ))}
      </div>

      {showRecords && (
        <div className="report-document__records">
          {records.map((record) => (
            <article key={record.id} className="report-document__card">
              {fields.map((field) => (
                <div key={field.id} className="report-document__row">
                  <span>{field.shortLabel}</span>
                  <strong>{renderValue(field, record[field.id])}</strong>
                </div>
              ))}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
