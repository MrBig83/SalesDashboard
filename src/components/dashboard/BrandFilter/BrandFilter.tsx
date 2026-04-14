import './BrandFilter.css'

interface BrandFilterProps {
  brands: string[]
  selectedBrand: string
  onChange: (brand: string) => void
}

export const BrandFilter = ({
  brands,
  selectedBrand,
  onChange,
}: BrandFilterProps) => (
  <div className="brand-filter">
    <label htmlFor="brand-select">Brand</label>
    <select
      id="brand-select"
      value={selectedBrand}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="ALL">Alla brands</option>
      {brands.map((brand) => (
        <option key={brand} value={brand}>
          {brand}
        </option>
      ))}
    </select>
  </div>
)
