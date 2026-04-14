import type { SummaryMetric } from '../../../types/report'
import { StatCard } from '../StatCard/StatCard'
import './StatGrid.css'

interface StatGridProps {
  metrics: SummaryMetric[]
}

export const StatGrid = ({ metrics }: StatGridProps) => (
  <section className="stat-grid">
    {metrics.map((metric) => (
      <StatCard
        key={metric.label}
        label={metric.label}
        value={metric.value}
        tone={metric.tone}
      />
    ))}
  </section>
)
