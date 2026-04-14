import './DateRangeFilter.css'

interface DateRangeFilterProps {
  dateFrom: string
  dateTo: string
  onChangeDateFrom: (value: string) => void
  onChangeDateTo: (value: string) => void
}

export const DateRangeFilter = ({
  dateFrom,
  dateTo,
  onChangeDateFrom,
  onChangeDateTo,
}: DateRangeFilterProps) => (
  <div className="date-range-filter">
    <div className="date-range-filter__field">
      <label htmlFor="date-from">Från datum</label>
      <input
        id="date-from"
        type="date"
        value={dateFrom}
        onChange={(event) => onChangeDateFrom(event.target.value)}
      />
    </div>
    <div className="date-range-filter__field">
      <label htmlFor="date-to">Till datum</label>
      <input
        id="date-to"
        type="date"
        value={dateTo}
        onChange={(event) => onChangeDateTo(event.target.value)}
      />
    </div>
  </div>
)
