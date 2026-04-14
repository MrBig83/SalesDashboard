import type { DataField, DataRecord } from '../../../types/report'
import { formatDate, formatNumber } from '../../../utils/formatters'
import './ReportPreview.css'

interface ReportPreviewProps {
  brand: string
  fields: DataField[]
  records: DataRecord[]
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

export const ReportPreview = ({ brand, fields, records }: ReportPreviewProps) => (
  <section className="report-preview">
    <div className="report-preview__header">
      <div>
        <span>Publik rapport</span>
        <h2>{brand === 'ALL' ? 'Alla brands' : brand}</h2>
      </div>
      <strong>{records.length} poster</strong>
    </div>
    <div className="report-preview__grid">
      {records.map((record) => (
        <article key={record.id} className="report-preview__card">
          {fields.map((field) => (
            <div key={field.id} className="report-preview__row">
              <span>{field.shortLabel}</span>
              <strong>{renderValue(field, record[field.id])}</strong>
            </div>
          ))}
        </article>
      ))}
    </div>
  </section>
)
