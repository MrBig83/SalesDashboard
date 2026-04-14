import { allFilterValue } from '../../../utils/reportFilters'
import './SelectFilter.css'

interface SelectFilterProps {
  id: string
  label: string
  value: string
  options: string[]
  allLabel: string
  onChange: (value: string) => void
}

export const SelectFilter = ({
  id,
  label,
  value,
  options,
  allLabel,
  onChange,
}: SelectFilterProps) => (
  <div className="select-filter">
    <label htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value={allFilterValue}>{allLabel}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
)
