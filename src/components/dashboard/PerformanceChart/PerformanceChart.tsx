import type { DataRecord, ReportFilters } from '../../../types/report'
import { formatCompactNumber, formatDate, formatNumber } from '../../../utils/formatters'
import { allFilterValue } from '../../../utils/reportFilters'
import './PerformanceChart.css'

interface PerformanceChartProps {
  records: DataRecord[]
  filters: ReportFilters
}

interface TrendPoint {
  label: string
  tastings: number
  purchases: number
}

const getTotal = (records: DataRecord[], key: 'tastings' | 'purchases' | 'passengers') =>
  records.reduce(
    (sum, record) => sum + (typeof record[key] === 'number' ? record[key] : 0),
    0,
  )

const getAverageScore = (records: DataRecord[]) => {
  const scores = records.filter(
    (record): record is DataRecord & { sessionScore: number } =>
      typeof record.sessionScore === 'number',
  )

  if (scores.length === 0) {
    return 0
  }

  return scores.reduce((sum, record) => sum + record.sessionScore, 0) / scores.length
}

const getTopBrands = (records: DataRecord[]) => {
  const grouped = records.reduce<Record<string, number>>((accumulator, record) => {
    const brand =
      typeof record.brand === 'string' && record.brand.length > 0
        ? record.brand
        : 'Okänt brand'

    accumulator[brand] = (accumulator[brand] ?? 0) + 1
    return accumulator
  }, {})

  return Object.entries(grouped)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
}

const getTrendPoints = (records: DataRecord[]): TrendPoint[] => {
  const grouped = records.reduce<Record<string, TrendPoint>>((accumulator, record) => {
    const rawDate =
      typeof record.activationDate === 'string' && record.activationDate.length > 0
        ? record.activationDate
        : 'Okänt datum'

    if (!accumulator[rawDate]) {
      accumulator[rawDate] = {
        label: rawDate === 'Okänt datum' ? rawDate : formatDate(rawDate),
        tastings: 0,
        purchases: 0,
      }
    }

    accumulator[rawDate].tastings += typeof record.tastings === 'number' ? record.tastings : 0
    accumulator[rawDate].purchases +=
      typeof record.purchases === 'number' ? record.purchases : 0

    return accumulator
  }, {})

  return Object.entries(grouped)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, point]) => point)
    .slice(0, 6)
}

interface PlotPoint {
  x: number
  y: number
}

const buildPlotPoints = (
  values: number[],
  width: number,
  height: number,
  padding = 12,
): PlotPoint[] => {
  const maxValue = Math.max(...values, 1)
  const drawableHeight = height - padding * 2

  return values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width
    const y = height - padding - (value / maxValue) * drawableHeight
    return { x, y }
  })
}

const buildPolyline = (points: PlotPoint[]) =>
  points.map((point) => `${point.x},${point.y}`).join(' ')

const getBestSession = (records: DataRecord[], metric: 'purchases' | 'tastings') =>
  [...records].sort((left, right) => {
    const leftValue = typeof left[metric] === 'number' ? left[metric] : 0
    const rightValue = typeof right[metric] === 'number' ? right[metric] : 0
    return rightValue - leftValue
  })[0]

const getTopLocationByPurchases = (records: DataRecord[]) => {
  const grouped = records.reduce<Record<string, number>>((accumulator, record) => {
    const location =
      typeof record.location === 'string' && record.location.length > 0
        ? record.location
        : 'Okänd plats'
    const purchases = typeof record.purchases === 'number' ? record.purchases : 0

    accumulator[location] = (accumulator[location] ?? 0) + purchases
    return accumulator
  }, {})

  return Object.entries(grouped).sort((left, right) => right[1] - left[1])[0]
}

const buildActiveSelection = (filters: ReportFilters) => {
  const parts: string[] = []

  if (filters.brand !== allFilterValue) {
    parts.push(`Brand: ${filters.brand}`)
  }

  if (filters.location !== allFilterValue) {
    parts.push(`Plats: ${filters.location}`)
  }

  if (filters.promotor !== allFilterValue) {
    parts.push(`Promotor: ${filters.promotor}`)
  }

  if (filters.dateFrom || filters.dateTo) {
    const from = filters.dateFrom ? formatDate(filters.dateFrom) : 'start'
    const to = filters.dateTo ? formatDate(filters.dateTo) : 'nu'
    parts.push(`Period: ${from} - ${to}`)
  }

  return parts.length > 0 ? parts.join(' • ') : 'Aktivt urval: Alla tillgängliga poster'
}

export const PerformanceChart = ({ records, filters }: PerformanceChartProps) => {
  const tastings = getTotal(records, 'tastings')
  const purchases = getTotal(records, 'purchases')
  const passengers = getTotal(records, 'passengers')
  const averageScore = getAverageScore(records)
  const purchaseRate = tastings > 0 ? (purchases / tastings) * 100 : 0
  const engagementRate = passengers > 0 ? (tastings / passengers) * 100 : 0
  const trendPoints = getTrendPoints(records)
  const topBrands = getTopBrands(records)
  const tastingPoints = buildPlotPoints(
    trendPoints.map((point) => point.tastings),
    320,
    128,
  )
  const purchasePoints = buildPlotPoints(
    trendPoints.map((point) => point.purchases),
    320,
    128,
  )
  const tastingLine = buildPolyline(tastingPoints)
  const purchaseLine = buildPolyline(purchasePoints)
  const bestPurchaseSession = getBestSession(records, 'purchases')
  const bestTastingSession = getBestSession(records, 'tastings')
  const topLocation = getTopLocationByPurchases(records)
  const activeSelection = buildActiveSelection(filters)
  const leadingBrand = topBrands[0]?.[0] ?? 'Inget brand'
  const singleTrendPoint = trendPoints[0]
  const maxSingleTrendValue = Math.max(
    singleTrendPoint?.tastings ?? 0,
    singleTrendPoint?.purchases ?? 0,
    1,
  )

  return (
    <section className="performance-chart">
      <div className="performance-chart__grid">
        <article className="performance-chart__panel performance-chart__panel--hero">
          <div className="performance-chart__hero-layout">
            <div className="performance-chart__hero-copy">
              <span className="performance-chart__eyebrow">Live Snapshot</span>
              <h2>Admin performance board</h2>
              <p>
                En tydlig lägesbild av kvalitet, räckvidd och konvertering i det
                valda urvalet.
              </p>
              <div className="performance-chart__selection">{activeSelection}</div>
              <div className="performance-chart__signals">
                <span>Ledande brand: {leadingBrand}</span>
              </div>
              <div className="performance-chart__hero-stats">
                <div className="performance-chart__hero-card">
                  <span>Poster</span>
                  <strong>{formatNumber(records.length)}</strong>
                </div>
                <div className="performance-chart__hero-card">
                  <span>Köpgrad</span>
                  <strong>{formatNumber(purchaseRate)}%</strong>
                </div>
                <div className="performance-chart__hero-card">
                  <span>Engagemang</span>
                  <strong>{formatNumber(engagementRate)}%</strong>
                </div>
              </div>
            </div>
            <div className="performance-chart__score-block">
              <span className="performance-chart__eyebrow">Kvalitet</span>
              <div className="performance-chart__score-ring">
                <div
                  className="performance-chart__score-fill"
                  style={{
                    background: `conic-gradient(#23d3ee ${(averageScore / 5) * 360}deg, rgba(255,255,255,0.08) 0deg)`,
                  }}
                >
                  <div className="performance-chart__score-core">
                    <strong>{formatNumber(averageScore)}</strong>
                    <span>av 5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="performance-chart__panel performance-chart__panel--trend">
          <div className="performance-chart__panel-header">
            <div>
              <span className="performance-chart__eyebrow">Trend</span>
              <h3>Sessionsutveckling</h3>
            </div>
            <strong>{trendPoints.length} punkter</strong>
          </div>
          <div className="performance-chart__sparkline">
            {trendPoints.length <= 1 && singleTrendPoint ? (
              <div className="performance-chart__single-period">
                <p className="performance-chart__single-period-label">{singleTrendPoint.label}</p>
                <div className="performance-chart__single-bars">
                  <div className="performance-chart__single-bar-group">
                    <div className="performance-chart__single-bar-track">
                      <div
                        className="performance-chart__single-bar performance-chart__single-bar--tastings"
                        style={{
                          height: `${(singleTrendPoint.tastings / maxSingleTrendValue) * 100}%`,
                        }}
                      />
                    </div>
                    <strong>{formatNumber(singleTrendPoint.tastings)}</strong>
                    <span>Tastings</span>
                  </div>
                  <div className="performance-chart__single-bar-group">
                    <div className="performance-chart__single-bar-track">
                      <div
                        className="performance-chart__single-bar performance-chart__single-bar--purchases"
                        style={{
                          height: `${(singleTrendPoint.purchases / maxSingleTrendValue) * 100}%`,
                        }}
                      />
                    </div>
                    <strong>{formatNumber(singleTrendPoint.purchases)}</strong>
                    <span>Köp</span>
                  </div>
                </div>
              </div>
            ) : (
              <svg viewBox="0 0 320 128" preserveAspectRatio="none" aria-hidden="true">
                <polyline
                  className="performance-chart__line performance-chart__line--tastings"
                  points={tastingLine}
                />
                <polyline
                  className="performance-chart__line performance-chart__line--purchases"
                  points={purchaseLine}
                />
              </svg>
            )}
          </div>
          <div className="performance-chart__legend">
            <span>
              <i className="performance-chart__dot performance-chart__dot--tastings" />
              Tastings
            </span>
            <span>
              <i className="performance-chart__dot performance-chart__dot--purchases" />
              Köp
            </span>
          </div>
          {trendPoints.length > 1 && (
            <div className="performance-chart__axis">
              {trendPoints.map((point) => (
                <span key={point.label}>{point.label}</span>
              ))}
            </div>
          )}
        </article>

        <article className="performance-chart__panel performance-chart__panel--volume">
          <div className="performance-chart__panel-header">
            <div>
              <span className="performance-chart__eyebrow">Volym</span>
              <h3>Totaler i urvalet</h3>
            </div>
          </div>
          <div className="performance-chart__volume-grid">
            <div className="performance-chart__volume-card">
              <span>Tastings totalt</span>
              <strong>{formatCompactNumber(tastings)}</strong>
            </div>
            <div className="performance-chart__volume-card">
              <span>Köp totalt</span>
              <strong>{formatCompactNumber(purchases)}</strong>
            </div>
            <div className="performance-chart__volume-card">
              <span>Passagerare totalt</span>
              <strong>{formatCompactNumber(passengers)}</strong>
            </div>
          </div>
        </article>

        <article className="performance-chart__panel performance-chart__panel--best">
          <div className="performance-chart__panel-header">
            <div>
              <span className="performance-chart__eyebrow">Bäst hittills</span>
              <h3>Starkaste utfall</h3>
            </div>
          </div>
          <div className="performance-chart__best-grid">
            <div className="performance-chart__best-card">
              <span>Högst köp i en session</span>
              <strong>
                {formatNumber(
                  typeof bestPurchaseSession?.purchases === 'number'
                    ? bestPurchaseSession.purchases
                    : 0,
                )}
              </strong>
              <small>
                {typeof bestPurchaseSession?.location === 'string'
                  ? bestPurchaseSession.location
                  : 'Ingen plats'}
              </small>
            </div>
            <div className="performance-chart__best-card">
              <span>Högst tastings i en session</span>
              <strong>
                {formatNumber(
                  typeof bestTastingSession?.tastings === 'number'
                    ? bestTastingSession.tastings
                    : 0,
                )}
              </strong>
              <small>
                {typeof bestTastingSession?.location === 'string'
                  ? bestTastingSession.location
                  : 'Ingen plats'}
              </small>
            </div>
            <div className="performance-chart__best-card">
              <span>Starkaste plats för köp</span>
              <strong>{topLocation ? topLocation[0] : 'Ingen plats'}</strong>
              <small>{formatNumber(topLocation ? topLocation[1] : 0)} köp totalt</small>
            </div>
          </div>
        </article>

        <article className="performance-chart__panel performance-chart__panel--brands">
          <div className="performance-chart__panel-header">
            <div>
              <span className="performance-chart__eyebrow">Fördelning</span>
              <h3>Top brands</h3>
            </div>
          </div>
          <div className="performance-chart__brand-list">
            {topBrands.map(([brand, count], index) => (
              <div key={brand} className="performance-chart__brand-item">
                <span className="performance-chart__rank">0{index + 1}</span>
                <div className="performance-chart__brand-copy">
                  <strong>{brand}</strong>
                  <span>{count} poster</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
