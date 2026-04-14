import type { DataField } from '../../../types/report'
import './FieldSelector.css'

interface FieldSelectorProps {
  fields: DataField[]
  selectedFieldIds: string[]
  onToggleField: (fieldId: string) => void
  onSelectAll: (fieldIds: string[]) => void
  onClearAll: () => void
}

export const FieldSelector = ({
  fields,
  selectedFieldIds,
  onToggleField,
  onSelectAll,
  onClearAll,
}: FieldSelectorProps) => (
  <section className="field-selector">
    <div className="field-selector__header">
      <div>
        <h2>Rapportfält</h2>
        <p>Välj exakt vilka kolumner som ska följa med i delningslänken.</p>
      </div>
      <div className="field-selector__actions">
        <button
          type="button"
          onClick={() => onSelectAll(fields.map((field) => field.id))}
        >
          Välj alla
        </button>
        <button
          type="button"
          className="field-selector__secondary"
          onClick={onClearAll}
        >
          Rensa urval
        </button>
      </div>
    </div>
    <div className="field-selector__grid">
      {fields.map((field) => (
        <label key={field.id} className="field-selector__item">
          <input
            type="checkbox"
            checked={selectedFieldIds.includes(field.id)}
            onChange={() => onToggleField(field.id)}
          />
          <span>{field.label}</span>
        </label>
      ))}
    </div>
  </section>
)
