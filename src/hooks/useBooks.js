import { useCallback, useEffect, useState } from 'react'

export function useBooks() {
  const [data, setData] = useState({ books: [], meta: null })
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const load = useCallback(async (forceRefresh = false) => {
    setStatus(forceRefresh ? 'refreshing' : 'loading')
    setError('')

    try {
      const response = await fetch(`/api/books${forceRefresh ? '?refresh=1' : ''}`)
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'データを取得できませんでした')
      setData(payload)
      setStatus('ready')
    } catch (loadError) {
      setError(loadError.message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load(false)
  }, [load])

  return { ...data, status, error, refresh: () => load(true) }
}
