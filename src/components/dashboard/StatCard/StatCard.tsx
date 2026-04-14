import './StatCard.css'

interface StatCardProps {
  label: string
  value: string
  tone?: 'default' | 'accent' | 'success'
}

export const StatCard = ({
  label,
  value,
  tone = 'default',
}: StatCardProps) => (
  <article className={`stat-card stat-card--${tone}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </article>
)
