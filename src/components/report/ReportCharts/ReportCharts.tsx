import type { DataRecord } from '../../../types/report'
import { formatCompactNumber, formatDate, formatNumber } from '../../../utils/formatters'
import './ReportCharts.css'

interface ReportChartsProps {
  records: DataRecord[]
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

const getTopLocations = (records: DataRecord[]) => {
  const grouped = records.reduce<Record<string, number>>((accumulator, record) => {
    const location =
      typeof record.location === 'string' && record.location.length > 0
        ? record.location
        : 'Okänd plats'

    accumulator[location] = (accumulator[location] ?? 0) + 1
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

const buildPolyline = (
  values: number[],
  width: number,
  height: number,
  padding = 12,
) => {
  const maxValue = Math.max(...values, 1)
  const drawableHeight = height - padding * 2

  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width
      const y = height - padding - (value / maxValue) * drawableHeight
      return `${x},${y}`
    })
    .join(' ')
}

export const ReportCharts = ({ records }: ReportChartsProps) => {
  const tastings = getTotal(records, 'tastings')
  const purchases = getTotal(records, 'purchases')
  const passengers = getTotal(records, 'passengers')
  const averageScore = getAverageScore(records)
  const purchaseRate = tastings > 0 ? (purchases / tastings) * 100 : 0
  const engagementRate = passengers > 0 ? (tastings / passengers) * 100 : 0
  const topLocations = getTopLocations(records)
  const trendPoints = getTrendPoints(records)
  const tastingLine = buildPolyline(
    trendPoints.map((point) => point.tastings),
    320,
    128,
  )
  const purchaseLine = buildPolyline(
    trendPoints.map((point) => point.purchases),
    320,
    128,
  )

  return (
    <section className="report-charts">
      <article className="report-charts__panel report-charts__panel--score">
        <div>
          <span className="report-charts__eyebrow">Kvalitet</span>
          <h2>Sessionsscore</h2>
          <p>Genomsnittet ger en snabb bild av hur urvalet faktiskt presterade.</p>
        </div>
        <div className="report-charts__score-ring">
          <div
            className="report-charts__score-fill"
            style={{
              background: `conic-gradient(#23d3ee ${(averageScore / 5) * 360}deg, rgba(255,255,255,0.08) 0deg)`,
            }}
          >
            <div className="report-charts__score-core">
              <strong>{formatNumber(averageScore)}</strong>
              <span>av 5</span>
            </div>
          </div>
        </div>
      </article>

      <article className="report-charts__panel report-charts__panel--trend">
        <div className="report-charts__header">
          <div>
            <span className="report-charts__eyebrow">Trend</span>
            <h2>Sessionsutveckling</h2>
          </div>
          <strong>{trendPoints.length} datapunkter</strong>
        </div>
        <div className="report-charts__sparkline">
          <svg viewBox="0 0 320 128" preserveAspectRatio="none" aria-hidden="true">
            <polyline
              className="report-charts__line report-charts__line--tastings"
              points={tastingLine}
            />
            <polyline
              className="report-charts__line report-charts__line--purchases"
              points={purchaseLine}
            />
          </svg>
        </div>
        <div className="report-charts__legend">
          <span>
            <i className="report-charts__dot report-charts__dot--tastings" />
            Tastings
          </span>
          <span>
            <i className="report-charts__dot report-charts__dot--purchases" />
            Köp
          </span>
        </div>
        <div className="report-charts__axis">
          {trendPoints.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </article>

      <article className="report-charts__panel report-charts__panel--volume">
        <div className="report-charts__header">
          <div>
            <span className="report-charts__eyebrow">Volym</span>
            <h2>Utfall i urvalet</h2>
          </div>
        </div>
        <div className="report-charts__volume-grid">
          <div className="report-charts__volume-card">
            <span>Tastings</span>
            <strong>{formatCompactNumber(tastings)}</strong>
          </div>
          <div className="report-charts__volume-card">
            <span>Köp</span>
            <strong>{formatCompactNumber(purchases)}</strong>
          </div>
          <div className="report-charts__volume-card">
            <span>Passagerare</span>
            <strong>{formatCompactNumber(passengers)}</strong>
          </div>
        </div>
      </article>

      <article className="report-charts__panel report-charts__panel--meters">
        <div className="report-charts__header">
          <div>
            <span className="report-charts__eyebrow">Konvertering</span>
            <h2>Nyckelförhållanden</h2>
          </div>
        </div>
        <div className="report-charts__meter-grid">
          <div className="report-charts__meter-card">
            <div className="report-charts__meter-value">{formatNumber(purchaseRate)}%</div>
            <div className="report-charts__meter-track">
              <div
                className="report-charts__meter-fill report-charts__meter-fill--amber"
                style={{ width: `${Math.min(purchaseRate, 100)}%` }}
              />
            </div>
            <span>Köp per tasting</span>
          </div>
          <div className="report-charts__meter-card">
            <div className="report-charts__meter-value">{formatNumber(engagementRate)}%</div>
            <div className="report-charts__meter-track">
              <div
                className="report-charts__meter-fill report-charts__meter-fill--cyan"
                style={{ width: `${Math.min(engagementRate, 100)}%` }}
              />
            </div>
            <span>Tastings per passagerare</span>
          </div>
        </div>
      </article>

      <article className="report-charts__panel report-charts__panel--locations">
        <div className="report-charts__header">
          <div>
            <span className="report-charts__eyebrow">Spridning</span>
            <h2>Toppplatser</h2>
          </div>
        </div>
        <div className="report-charts__location-list">
          {topLocations.map(([location, count], index) => (
            <div key={location} className="report-charts__location-item">
              <span className="report-charts__rank">0{index + 1}</span>
              <div className="report-charts__location-copy">
                <strong>{location}</strong>
                <span>{count} poster</span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
