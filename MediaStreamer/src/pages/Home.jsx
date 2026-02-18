// pages/Home.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchTrending, searchVideos } from '../lib/api'
import VideoCard from '../components/VideoCard'
import CategoryFilters from '../components/CategoryFilters'
import { useSearchHistory } from '../context/SearchHistoryContext'

const CATEGORIES = [
  'All','Music','Gaming','News','Sports',
  'Technology','Movies','Learning','Live','Comedy','Fashion','Cooking',
]

export default function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('search') || ''

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextPageToken, setNextPageToken] = useState(null)
  const [error, setError] = useState(null)

  const loaderRef = useRef(null)
  const { addToSearchHistory } = useSearchHistory()

  // ── Initial load ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    setVideos([])
    setNextPageToken(null)

    const load = async () => {
      try {
        if (query) addToSearchHistory(query)
        const data = query
          ? await searchVideos(query, 12)
          : await fetchTrending(12)
        if (alive) {
          setVideos(data.videos)
          setNextPageToken(data.nextPageToken)
        }
      } catch (err) {
        console.error(err)
        if (alive) setError('Failed to load videos. Please try again.')
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => { alive = false }
  }, [query, addToSearchHistory])

  // ── Infinite scroll ───────────────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (loadingMore || !nextPageToken) return
    setLoadingMore(true)
    try {
      const data = query
        ? await searchVideos(query, 12, nextPageToken)
        : await fetchTrending(12, nextPageToken)
      setVideos(prev => [...prev, ...data.videos])
      setNextPageToken(data.nextPageToken)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, nextPageToken, query])

  useEffect(() => {
    if (loading || !loaderRef.current) return
    const obs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting && nextPageToken) loadMore() },
      { threshold: 0.1, rootMargin: '300px' }
    )
    obs.observe(loaderRef.current)
    return () => obs.disconnect()
  }, [loading, nextPageToken, loadMore])

  // ── Error ──────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={S.center}>
        <span style={{ fontSize: 52, display: 'block', marginBottom: 16 }}>😕</span>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h2>
        <p style={{ color: '#aaa', marginBottom: 24 }}>{error}</p>
        <button onClick={() => window.location.reload()} style={S.retryBtn}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      <style>{css}</style>
      <div style={S.page}>

        {/* Category chips */}
        <CategoryFilters
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Search heading */}
        {query && !loading && (
          <p style={S.searchHeading}>
            Results for <strong style={{ color: '#fff' }}>"{query}"</strong>
            <span style={{ color: '#555' }}> — {videos.length}{nextPageToken ? '+' : ''} videos</span>
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div style={S.grid}>
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : videos.length === 0 ? (
          <div style={S.center}>
            <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>🔍</span>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No videos found</h3>
            <p style={{ color: '#717171' }}>Try different search terms</p>
          </div>
        ) : (
          <div className="home-fade" style={S.grid}>
            {videos.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={loaderRef} style={S.sentinel}>
          {loadingMore && <Spinner />}
          {!loading && !nextPageToken && videos.length > 0 && (
            <p style={S.endMsg}>— No more videos —</p>
          )}
        </div>

      </div>
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{
      width: 28, height: 28,
      border: '3px solid #222',
      borderTop: '3px solid #ff0000',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

function SkeletonCard() {
  return (
    <div>
      <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12, background: '#181818', animation: 'pulse 1.6s ease infinite', marginBottom: 12 }} />
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#181818', animation: 'pulse 1.6s ease infinite', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 13, background: '#181818', borderRadius: 6, marginBottom: 8, animation: 'pulse 1.6s ease infinite' }} />
          <div style={{ height: 11, width: '65%', background: '#181818', borderRadius: 6, animation: 'pulse 1.6s ease infinite' }} />
        </div>
      </div>
    </div>
  )
}

// ── CSS ────────────────────────────────────────────────────────────────────────
const css = `
  @keyframes spin  { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:.7} }
  @keyframes fadeIn{ from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  .home-fade { animation: fadeIn 0.28s ease both; }
  .retry-btn:hover { background: #cc0000 !important; }
`

// ── Styles ─────────────────────────────────────────────────────────────────────
const S = {
  page: {
    maxWidth: 1700,
    margin: '0 auto',
  },
  searchHeading: {
    color: '#aaa',
    fontSize: 15,
    marginBottom: 20,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
    gap: '28px 16px',
  },
  sentinel: {
    height: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  endMsg: {
    color: '#2a2a2a',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    textAlign: 'center',
    padding: 20,
  },
  retryBtn: {
    padding: '10px 26px',
    background: '#ff0000',
    color: '#fff',
    border: 'none',
    borderRadius: 22,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
}