import type { DataField, DataRecord } from '../../../types/report'
import { formatDate, formatNumber } from '../../../utils/formatters'
import './DataTable.css'

interface DataTableProps {
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

export const DataTable = ({ fields, records }: DataTableProps) => (
  <section className={`data-table ${fields.length > 10 ? 'data-table--compact' : ''}`}>
    <div className="data-table__header">
      <h2>Detaljvy</h2>
      <p>Tabellen speglar exakt det som kommer med i rapportlänken.</p>
    </div>
    <div className="data-table__scroll">
      <table>
        <thead>
          <tr>
            {fields.map((field) => (
              <th key={field.id}>{field.shortLabel}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              {fields.map((field) => (
                <td key={field.id}>{renderValue(field, record[field.id])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)
