import { memo } from 'react'
import { Icon } from './Icons.jsx'

const headers = ['書名', '営業DM', '配信開始日', '著者', '勤務先', '勤務先電話（テレアポ）', '会社URL', 'Facebook', 'Instagram']

function SocialLink({ platform, url }) {
  if (!url) return <span className="muted-value">未確認</span>

  const handle = new URL(url).pathname.split('/').filter(Boolean).at(-1)
  return (
    <a className={`social-link social-${platform}`} href={url} target="_blank" rel="noreferrer">
      <Icon name={platform} size={17} />
      {handle ? `@${handle}` : '開く'}
    </a>
  )
}

const BookRow = memo(function BookRow({ book, copiedMessage, copiedPhone, onCopyMessage, onCopyPhone }) {
  const authorName = book.authors.join('、') || '著者'
  const hasPhone = book.employerPhone && !['未確認', '公開なし'].includes(book.employerPhone)
  const dialNumber = hasPhone ? book.employerPhone.replaceAll('-', '') : ''

  return (
    <tr>
      <td className="title-cell">
        <a href={book.bookUrl} target="_blank" rel="noreferrer">{book.title}</a>
      </td>
      <td>
        <button
          aria-label={`${authorName}さん向けの営業DMをコピー`}
          className={`copy-message-button${copiedMessage ? ' is-copied' : ''}`}
          onClick={() => onCopyMessage(book)}
          type="button"
        >
          <Icon name={copiedMessage ? 'check' : 'copy'} size={16} />
          {copiedMessage ? 'コピー済み' : 'DMをコピー'}
        </button>
      </td>
      <td><time>{book.releaseDate}</time></td>
      <td>{book.authors.join('、') || '未確認'}</td>
      <td className="company-cell">
        <span>{book.employerName}</span>
        {book.employmentStatus === 'confirmed' ? <small>公開プロフィール確認</small> : null}
      </td>
      <td className="phone-cell">
        {hasPhone ? (
          <div className="phone-actions">
            <a aria-label={`${book.employerName}へ電話をかける`} className="phone-link" href={`tel:${dialNumber}`}>
              <Icon name="phone" size={16} /> {book.employerPhone}
            </a>
            <button
              aria-label={`${book.employerName}の電話番号をコピー`}
              className={`phone-copy-button${copiedPhone ? ' is-copied' : ''}`}
              onClick={() => onCopyPhone(book)}
              type="button"
            >
              <Icon name={copiedPhone ? 'check' : 'copy'} size={14} />
              {copiedPhone ? 'コピー済み' : '番号をコピー'}
            </button>
          </div>
        ) : <span className="muted-value">{book.employerPhone || '未確認'}</span>}
      </td>
      <td>
        {book.employerUrl ? (
          <a className="inline-link" href={book.employerUrl} target="_blank" rel="noreferrer">
            {new URL(book.employerUrl).hostname.replace(/^www\./, '')} <Icon name="external" size={16} />
          </a>
        ) : <span className="muted-value">未確認</span>}
      </td>
      <td><SocialLink platform="facebook" url={book.facebookUrl} /></td>
      <td><SocialLink platform="instagram" url={book.instagramUrl} /></td>
    </tr>
  )
})

export function BooksTable({ books, copiedBookId, copiedPhoneBookId, isStale, onCopyMessage, onCopyPhone }) {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <p>条件に一致する本がありません。</p>
        <span>検索語を短くして、もう一度お試しください。</span>
      </div>
    )
  }

  return (
    <div className="table-scroll" style={{ opacity: isStale ? 0.64 : 1 }}>
      <table>
        <thead>
          <tr>
            {headers.map((header) => <th key={header} scope="col">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <BookRow
              key={book.id}
              book={book}
              copiedMessage={copiedBookId === book.id}
              copiedPhone={copiedPhoneBookId === book.id}
              onCopyMessage={onCopyMessage}
              onCopyPhone={onCopyPhone}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
