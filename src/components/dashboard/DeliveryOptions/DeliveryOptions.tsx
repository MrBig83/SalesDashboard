import type { ReportDeliveryMode } from '../../../types/report'
import './DeliveryOptions.css'

interface DeliveryOptionsProps {
  deliveryMode: ReportDeliveryMode
  onChange: (mode: ReportDeliveryMode) => void
}

export const DeliveryOptions = ({
  deliveryMode,
  onChange,
}: DeliveryOptionsProps) => (
  <section className="delivery-options">
    <div className="delivery-options__header">
      <h2>Rapportvägar</h2>
      <p>Byggd för två utleveranssätt: delningslänk nu, PDF i nästa steg.</p>
    </div>
    <div className="delivery-options__grid">
      <button
        type="button"
        className={`delivery-options__card ${deliveryMode === 'link' ? 'is-active' : ''}`}
        onClick={() => onChange('link')}
      >
        <strong>Dynamisk länk</strong>
        <span>Aktiv. Delar exakt samma filter och valda fält.</span>
      </button>
      <button
        type="button"
        className={`delivery-options__card delivery-options__card--muted ${deliveryMode === 'pdf' ? 'is-active' : ''}`}
        onClick={() => onChange('pdf')}
      >
        <strong>PDF-export</strong>
        <span>Förberedd i strukturen. Renderas senare från samma rapportdokument.</span>
      </button>
    </div>
  </section>
)
