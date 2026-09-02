import { Icon } from './Icons.jsx'

export function Toolbar({ confirmedCount, count, employmentFilter, query, setEmploymentFilter, setQuery, sort, setSort }) {
  return (
    <div className="toolbar">
      <label className="search-field">
        <span className="sr-only">書名・著者・勤務先で検索</span>
        <Icon name="search" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="書名・著者・勤務先で検索"
          type="search"
        />
      </label>
      <label className="select-field compact-select">
        <span className="sr-only">表示対象</span>
        <select value={employmentFilter} onChange={(event) => setEmploymentFilter(event.target.value)} aria-label="表示対象">
          <option value="all">すべて</option>
          <option value="confirmed">勤務先確認済み</option>
        </select>
        <Icon name="chevron" size={16} />
      </label>
      <label className="select-field">
        <span className="sr-only">並び順</span>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="並び順">
          <option value="rank">掲載順</option>
          <option value="newest">新着順</option>
          <option value="oldest">古い順</option>
          <option value="title">書名順</option>
        </select>
        <Icon name="chevron" size={16} />
      </label>
      <div className="toolbar-summary">
        <span>表示 <strong>{count}</strong>件</span>
        <span className="verified"><Icon name="check" size={19} /> 勤務先確認済み <strong>{confirmedCount}</strong>件</span>
      </div>
    </div>
  )
}
