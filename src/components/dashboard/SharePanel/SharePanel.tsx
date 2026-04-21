import { truncateText } from '../../../utils/text'
import './SharePanel.css'

interface SharePanelProps {
  shareUrl: string
  includePdfRecords: boolean
  onCopy: () => void
  onExportPdf: () => void
  onIncludePdfRecordsChange: (includeRecords: boolean) => void
  onReset: () => void
}

export const SharePanel = ({
  shareUrl,
  includePdfRecords,
  onCopy,
  onExportPdf,
  onIncludePdfRecordsChange,
  onReset,
}: SharePanelProps) => (
  <section className="share-panel">
    <div>
      <h2>Dynamisk rapportlänk</h2>
      <p>Länken sparar rapporturvalet bakom en kort kod. Ingen PIN krävs.</p>
    </div>
    <code title={shareUrl}>{truncateText(shareUrl)}</code>
    <label className="share-panel__option">
      <input
        type="checkbox"
        checked={includePdfRecords}
        onChange={(event) => onIncludePdfRecordsChange(event.target.checked)}
      />
      <span>Ta med detaljkort i PDF</span>
    </label>
    <div className="share-panel__actions">
      <button type="button" onClick={onCopy}>
        Kopiera länk
      </button>
      <button type="button" onClick={onExportPdf}>
        Exportera PDF
      </button>
      <button type="button" className="share-panel__secondary" onClick={onReset}>
        Återställ val
      </button>
    </div>
  </section>
)
