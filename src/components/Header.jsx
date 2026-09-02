import { Icon } from './Icons.jsx'

export function Header({ isRefreshing, onExport, onRefresh }) {
  return (
    <header className="app-header">
      <div className="brand-wrap">
        <div className="brand-mark" aria-hidden="true" />
        <a className="brand" href="#top" aria-label="営業リスト ホーム">
          <span className="brand-jp">営業リスト</span>
          <span className="brand-en">BOOK PIPELINE</span>
        </a>
      </div>
      <div className="header-actions">
        <button className="button button-secondary" type="button" onClick={onRefresh} disabled={isRefreshing}>
          <Icon name="refresh" className={isRefreshing ? 'spin' : ''} />
          {isRefreshing ? '更新しています…' : '最新情報に更新'}
        </button>
        <button className="button button-primary" type="button" onClick={onExport}>
          <Icon name="download" />
          CSVを書き出す
        </button>
      </div>
    </header>
  )
}
