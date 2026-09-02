import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { AppFooter } from './components/AppFooter.jsx'
import { BooksTable } from './components/BooksTable.jsx'
import { Header } from './components/Header.jsx'
import { LeadIntro } from './components/LeadIntro.jsx'
import { OutreachSettings } from './components/OutreachSettings.jsx'
import { StatusRail } from './components/StatusRail.jsx'
import { Toolbar } from './components/Toolbar.jsx'
import { useBooks } from './hooks/useBooks.js'
import { buildInstagramOutreachMessage, defaultOutreachProfile } from './lib/outreachMessage.js'

const PROFILE_STORAGE_KEY = 'book-pipeline-outreach-profile-v2'

function loadOutreachProfile() {
  try {
    return { ...defaultOutreachProfile, ...JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY)) }
  } catch {
    return defaultOutreachProfile
  }
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.append(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

function releaseTime(book) {
  if (!book.releaseDate || book.releaseDate === '未確認') return 0
  return Date.parse(book.releaseDate.replaceAll('/', '-')) || 0
}

function escapeCsv(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

export function App() {
  const { books, meta, status, error, refresh } = useBooks()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('rank')
  const [employmentFilter, setEmploymentFilter] = useState('all')
  const [outreachProfile, setOutreachProfile] = useState(loadOutreachProfile)
  const [copiedBookId, setCopiedBookId] = useState(null)
  const [copyError, setCopyError] = useState('')
  const copyResetTimer = useRef(null)
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase('ja'))

  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(outreachProfile))
  }, [outreachProfile])

  useEffect(() => () => clearTimeout(copyResetTimer.current), [])

  const handleCopyMessage = useCallback(async (book) => {
    try {
      await copyText(buildInstagramOutreachMessage(book, outreachProfile))
      setCopyError('')
      setCopiedBookId(book.id)
      clearTimeout(copyResetTimer.current)
      copyResetTimer.current = setTimeout(() => setCopiedBookId(null), 2400)
    } catch {
      setCopyError('コピーできませんでした。ブラウザのクリップボード権限をご確認ください。')
    }
  }, [outreachProfile])

  const visibleBooks = useMemo(() => {
    const employmentFiltered = employmentFilter === 'confirmed'
      ? books.filter((book) => book.employmentStatus === 'confirmed')
      : books
    const filtered = deferredQuery
      ? employmentFiltered.filter((book) => `${book.title} ${book.authors.join(' ')} ${book.employerName} ${book.facebookUrl} ${book.instagramUrl}`.toLocaleLowerCase('ja').includes(deferredQuery))
      : employmentFiltered

    if (sort === 'rank') return filtered
    return [...filtered].sort((a, b) => {
      if (sort === 'newest') return releaseTime(b) - releaseTime(a)
      if (sort === 'oldest') return releaseTime(a) - releaseTime(b)
      return a.title.localeCompare(b.title, 'ja')
    })
  }, [books, deferredQuery, employmentFilter, sort])

  function exportCsv() {
    const header = ['書名', '配信開始日', '著者', '勤務先', '会社URL', '会社電話', 'Facebook', 'Instagram', 'Instagram営業DM']
    const rows = visibleBooks.map((book) => [
      book.title,
      book.releaseDate,
      book.authors.join('、'),
      book.employerName,
      book.employerUrl,
      book.employerPhone,
      book.facebookUrl,
      book.instagramUrl,
      buildInstagramOutreachMessage(book, outreachProfile),
    ])
    const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\r\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `book-pipeline-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const isBusy = status === 'loading' || status === 'refreshing'

  return (
    <div className="app-shell" id="top">
      <Header
        isRefreshing={status === 'refreshing'}
        onExport={exportCsv}
        onRefresh={refresh}
      />
      <main>
        <LeadIntro />
        <StatusRail meta={meta} status={status} />
        {meta?.warning ? <div className="notice notice-warning">{meta.warning}</div> : null}
        {error ? <div className="notice notice-error">{error}<button type="button" onClick={refresh}>再試行</button></div> : null}
        {copyError ? <div className="notice notice-error" role="alert">{copyError}</div> : null}
        <OutreachSettings profile={outreachProfile} setProfile={setOutreachProfile} />
        <Toolbar
          confirmedCount={books.filter((book) => book.employmentStatus === 'confirmed').length}
          count={visibleBooks.length}
          employmentFilter={employmentFilter}
          query={query}
          setEmploymentFilter={setEmploymentFilter}
          setQuery={setQuery}
          sort={sort}
          setSort={setSort}
        />
        {isBusy && books.length === 0 ? <div className="loading-table" aria-label="データを取得しています"><span /><span /><span /><span /></div> : (
          <BooksTable
            books={visibleBooks}
            copiedBookId={copiedBookId}
            isStale={query.trim().toLocaleLowerCase('ja') !== deferredQuery}
            onCopyMessage={handleCopyMessage}
          />
        )}
      </main>
      <AppFooter meta={meta} />
    </div>
  )
}
