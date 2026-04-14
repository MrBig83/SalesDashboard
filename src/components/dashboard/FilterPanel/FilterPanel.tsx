import type { ReportFilters } from '../../../types/report'
import { DateRangeFilter } from '../DateRangeFilter/DateRangeFilter'
import { SelectFilter } from '../SelectFilter/SelectFilter'
import './FilterPanel.css'

interface FilterPanelProps {
  filters: ReportFilters
  brands: string[]
  locations: string[]
  promotors: string[]
  onFilterChange: <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => void
  onResetFilters: () => void
}

export const FilterPanel = ({
  filters,
  brands,
  locations,
  promotors,
  onFilterChange,
  onResetFilters,
}: FilterPanelProps) => (
  <section className="filter-panel">
    <div className="filter-panel__header">
      <div>
        <h2>Filter</h2>
        <p>
          Brand är fortfarande styrande, men nu kan du även begränsa per plats,
          promotor och datum.
        </p>
      </div>
      <button
        type="button"
        className="filter-panel__reset"
        onClick={onResetFilters}
      >
        Återställ filter
      </button>
    </div>
    <div className="filter-panel__grid">
      <SelectFilter
        id="brand-filter"
        label="Brand"
        value={filters.brand}
        options={brands}
        allLabel="Alla brands"
        onChange={(value) => onFilterChange('brand', value)}
      />
      <SelectFilter
        id="location-filter"
        label="Plats"
        value={filters.location}
        options={locations}
        allLabel="Alla platser"
        onChange={(value) => onFilterChange('location', value)}
      />
      <SelectFilter
        id="promotor-filter"
        label="Promotor"
        value={filters.promotor}
        options={promotors}
        allLabel="Alla promotors"
        onChange={(value) => onFilterChange('promotor', value)}
      />
      <DateRangeFilter
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onChangeDateFrom={(value) => onFilterChange('dateFrom', value)}
        onChangeDateTo={(value) => onFilterChange('dateTo', value)}
      />
    </div>
  </section>
)
