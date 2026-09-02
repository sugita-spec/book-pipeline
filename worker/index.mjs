import * as cheerio from 'cheerio'
import fallbackCache from '../server/cache.json' with { type: 'json' }
import { findEmployment } from '../server/authorDirectory.mjs'

const sourceUrl = 'https://bookwalker.jp/tag/306/?order=rank&detail=1&qcom=992&np=1'
const cacheTtlSeconds = 15 * 60
const requestHeaders = {
  'user-agent': 'Mozilla/5.0 (compatible; BookPipeline/1.0; +public-sales-research-tool)',
  'accept-language': 'ja,en;q=0.8',
}

function json(data, init = {}) {
  const headers = new Headers(init.headers)
  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('x-content-type-options', 'nosniff')
  return new Response(JSON.stringify(data), { ...init, headers })
}

async function fetchHtml(url, timeoutMs = 20_000) {
  const response = await fetch(url, {
    headers: requestHeaders,
    signal: AbortSignal.timeout(timeoutMs),
  })

  if (!response.ok) throw new Error(`取得に失敗しました (${response.status})`)
  return response.text()
}

function cleanText(value = '') {
  return value.replace(/\s+/g, ' ').trim()
}

function parseList(html) {
  const $ = cheerio.load(html)

  return $('.m-list-card')
    .map((_, element) => {
      const row = $(element)
      const titleLink = row.find('a[data-action-label="書名"]').first()
      const bookUrl = titleLink.attr('href') || ''
      const authors = row
        .find('a[data-action-label="著者名"]')
        .map((__, author) => cleanText($(author).text()))
        .get()
        .filter(Boolean)
      const title = cleanText(row.find('.o-card-ttl__text').first().text())
      const uuid = titleLink.attr('data-uuid') || bookUrl.split('/').filter(Boolean).at(-1)?.replace(/^de/, '') || ''

      if (!title || !bookUrl) return null
      return { id: uuid || bookUrl, title, authors, bookUrl }
    })
    .get()
    .filter(Boolean)
}

function parseReleaseDate(html) {
  const $ = cheerio.load(html)
  let value = ''

  $('dt').each((_, element) => {
    if (cleanText($(element).text()) === '配信開始日') {
      value = cleanText($(element).next('dd').text())
      return false
    }
    return undefined
  })

  return value
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length)
  let cursor = 0

  async function run() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await mapper(items[index])
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run))
  return results
}

async function refreshBooks() {
  const list = parseList(await fetchHtml(sourceUrl))
  if (list.length === 0) throw new Error('書籍一覧を解析できませんでした')

  const previousDates = new Map(fallbackCache.books.map((book) => [book.bookUrl, book.releaseDate]))
  const enriched = await mapWithConcurrency(list, 6, async (book) => {
    try {
      const detailHtml = await fetchHtml(book.bookUrl, 15_000)
      return { ...book, releaseDate: parseReleaseDate(detailHtml) || previousDates.get(book.bookUrl) || '未確認' }
    } catch {
      return { ...book, releaseDate: previousDates.get(book.bookUrl) || '未確認' }
    }
  })

  const books = enriched.map((book) => ({ ...book, ...findEmployment(book.authors) }))
  return {
    books,
    meta: {
      sourceUrl,
      sourceLabel: 'ビジネス × 幻冬舎メディアコンサルティング',
      updatedAt: new Date().toISOString(),
      cached: false,
      total: books.length,
      confirmedEmployers: books.filter((book) => book.employmentStatus === 'confirmed').length,
      notice: '勤務先は公開プロフィールをもとに確認。確認できない著者は「未確認」と表示します。',
    },
  }
}

function fallbackPayload(error) {
  return {
    ...fallbackCache,
    meta: {
      ...fallbackCache.meta,
      cached: true,
      warning: `最新情報を取得できなかったため、保存済みデータを表示しています。${error.message}`,
    },
  }
}

async function booksResponse(request, ctx) {
  const requestUrl = new URL(request.url)
  const forceRefresh = requestUrl.searchParams.get('refresh') === '1'
  const cacheKey = new Request(`${requestUrl.origin}/api/books`, { method: 'GET' })
  const edgeCache = caches.default

  if (!forceRefresh) {
    const cached = await edgeCache.match(cacheKey)
    if (cached) return cached
  }

  try {
    const response = json(await refreshBooks(), {
      headers: { 'cache-control': `public, max-age=0, s-maxage=${cacheTtlSeconds}` },
    })
    ctx.waitUntil(edgeCache.put(cacheKey, response.clone()))
    return response
  } catch (error) {
    console.error(JSON.stringify({ event: 'book_refresh_failed', message: error.message }))
    return json(fallbackPayload(error), {
      headers: { 'cache-control': 'public, max-age=0, s-maxage=300' },
    })
  }
}

export default {
  async fetch(request, _env, ctx) {
    const url = new URL(request.url)

    if (request.method !== 'GET') {
      return json({ error: 'Method Not Allowed' }, { status: 405, headers: { allow: 'GET' } })
    }
    if (url.pathname === '/api/health') return json({ ok: true })
    if (url.pathname === '/api/books') return booksResponse(request, ctx)
    return json({ error: 'Not Found' }, { status: 404 })
  },
}
