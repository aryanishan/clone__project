// pages/Watch.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getVideo, fetchTrending } from '../lib/api'
import { useHistory } from '../context/HistoryContext'
import RecommendationCard from '../components/RecommendationCard'
import VideoActions from '../components/VideoActions'
import Comments from '../components/Comments'

export default function Watch() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToHistory } = useHistory()

  const [video, setVideo] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    if (!id) return
    let alive = true
    setLoading(true)
    setError(false)
    setShowMore(false)
    window.scrollTo(0, 0)

    const load = async () => {
      try {
        const videoData = await getVideo(id)
        if (!alive) return

        if (!videoData) { setError(true); setLoading(false); return }

        setVideo(videoData)
        addToHistory(videoData)

        const trending = await fetchTrending(12)
        if (alive) {
          setRecommendations(trending.videos.filter(v => v.id !== id).slice(0, 10))
        }
      } catch (err) {
        console.error('Failed to load video:', err)
        if (alive) setError(true)
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => { alive = false }
  }, [id, addToHistory])

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={S.center}>
          <div style={S.spinner} />
          <p style={{ color: '#555', fontSize: 14, marginTop: 14 }}>Loading video…</p>
        </div>
      </>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !video) {
    return (
      <div style={S.center}>
        <span style={{ fontSize: 56, display: 'block', marginBottom: 16 }}>😕</span>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Video unavailable</h2>
        <p style={{ color: '#aaa', marginBottom: 28, maxWidth: 380, textAlign: 'center', lineHeight: 1.6 }}>
          This video may be private, removed, or unavailable in your region.
        </p>
        <Link to="/" style={S.homeBtn}>Go back home</Link>
      </div>
    )
  }

  const description = video.description || ''

  return (
    <>
      <style>{css}</style>
      <div style={S.page}>

        {/* ── Main column ── */}
        <div style={S.main}>

          {/* Player */}
          <div style={S.playerWrap}>
            <iframe
              key={id}
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&color=white`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={S.iframe}
            />
          </div>

          {/* Title */}
          <h1 style={S.title}>{video.title}</h1>

          {/* Channel + like/share/subscribe */}
          <VideoActions video={video} />

          {/* Description */}
          <div
            style={S.descBox}
            onClick={() => setShowMore(s => !s)}
          >
            <p style={S.descMeta}>
              {video.views} &nbsp;·&nbsp; {video.time}
            </p>
            <p style={S.descText}>
              {showMore ? description : description.slice(0, 200) + (description.length > 200 ? '…' : '')}
            </p>
            {description.length > 200 && (
              <button style={S.showMoreBtn}>
                {showMore ? 'Show less ▲' : 'Show more ▼'}
              </button>
            )}
          </div>

          {/* Comments */}
          <Comments videoId={id} />

        </div>

        {/* ── Recommendations sidebar ── */}
        <aside style={S.sidebar}>
          <h3 style={S.sidebarTitle}>Up next</h3>
          <div style={S.recList}>
            {recommendations.length > 0
              ? recommendations.map(v => <RecommendationCard key={v.id} video={v} />)
              : <p style={{ color: '#555', fontSize: 13, padding: '20px 0' }}>No recommendations available</p>
            }
          </div>
        </aside>

      </div>
    </>
  )
}

// ── CSS ────────────────────────────────────────────────────────────────────────
const css = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .show-more-btn:hover { color: #fff !important; }
  .home-btn:hover { background: #cc0000 !important; }
`

// ── Styles ─────────────────────────────────────────────────────────────────────
const S = {
  page: {
    display: 'flex',
    gap: 26,
    maxWidth: 1560,
    margin: '0 auto',
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  playerWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    background: '#000',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 18,
    boxShadow: '0 10px 50px rgba(0,0,0,0.7)',
  },
  iframe: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
  title: {
    fontSize: 21,
    fontWeight: 800,
    lineHeight: 1.4,
    marginBottom: 16,
    color: '#fff',
  },
  descBox: {
    background: '#141414',
    border: '1px solid #1e1e1e',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    cursor: 'pointer',
  },
  descMeta: {
    fontSize: 13,
    color: '#717171',
    marginBottom: 8,
    fontWeight: 600,
  },
  descText: {
    fontSize: 14,
    color: '#ddd',
    lineHeight: 1.75,
    whiteSpace: 'pre-wrap',
  },
  showMoreBtn: {
    background: 'none',
    border: 'none',
    color: '#aaa',
    fontSize: 14,
    fontWeight: 800,
    marginTop: 12,
    cursor: 'pointer',
    padding: 0,
    transition: 'color 0.15s',
  },
  sidebar: {
    width: 406,
    flexShrink: 0,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 14,
    color: '#e0e0e0',
  },
  recList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    textAlign: 'center',
    padding: 20,
  },
  spinner: {
    width: 48, height: 48,
    border: '3px solid #222',
    borderTop: '3px solid #ff0000',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  homeBtn: {
    padding: '12px 28px',
    background: '#ff0000',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 28,
    fontSize: 14,
    fontWeight: 800,
    transition: 'background 0.2s',
  },
}