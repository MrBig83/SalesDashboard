import { truncateText } from '../../../utils/text'
import './SharePanel.css'

interface SharePanelProps {
  shareUrl: string
  onCopy: () => void
  onReset: () => void
}

export const SharePanel = ({ shareUrl, onCopy, onReset }: SharePanelProps) => (
  <section className="share-panel">
    <div>
      <h2>Dynamisk rapportlänk</h2>
      <p>
        Länken bygger på valda filter och valda fält. Mottagaren ser bara det
        urvalet.
      </p>
    </div>
    <code title={shareUrl}>{truncateText(shareUrl)}</code>
    <div className="share-panel__actions">
      <button type="button" onClick={onCopy}>
        Kopiera länk
      </button>
      <button type="button" className="share-panel__secondary" onClick={onReset}>
        Återställ val
      </button>
    </div>
  </section>
)
