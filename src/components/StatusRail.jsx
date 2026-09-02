import { Icon } from './Icons.jsx'

function formatUpdatedAt(value) {
  if (!value) return '取得中'
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

export function StatusRail({ meta, status }) {
  const busy = status === 'loading' || status === 'refreshing'
  return (
    <div className="status-rail" aria-live="polite">
      <div>対象: {meta?.sourceLabel || 'ビジネス × 幻冬舎メディアコンサルティング'}</div>
      <div className="update-state">
        <span className={`status-dot ${busy ? 'pulse' : ''}`} />
        <span>{busy ? '取得中' : meta?.cached ? 'キャッシュ表示' : '更新済み'}</span>
        <time dateTime={meta?.updatedAt}>{formatUpdatedAt(meta?.updatedAt)}</time>
        <Icon name="refresh" size={18} className={busy ? 'spin' : ''} />
      </div>
    </div>
  )
}
