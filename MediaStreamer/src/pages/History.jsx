// pages/History.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from '../context/HistoryContext'
import VideoCard from '../components/VideoCard'

export default function History() {
  const { watchHistory, clearHistory, removeFromHistory } = useHistory()

  const getDateLabel = (dateString) => {
    const date = new Date(dateString)
    const now  = new Date()
    const diffDays = Math.floor((now - date) / 86400000)
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  const grouped = watchHistory.reduce((acc, video) => {
    const label = getDateLabel(video.watchedAt)
    if (!acc[label]) acc[label] = []
    acc[label].push(video)
    return acc
  }, {})

  return (
    <>
      <style>{css}</style>
      <div style={S.page}>

        {/* Header */}
        <div style={S.header}>
          <h1 style={S.title}>Watch History</h1>
          {watchHistory.length > 0 && (
            <button className="hist-clear-btn" style={S.clearBtn} onClick={clearHistory}>
              Clear All History
            </button>
          )}
        </div>

        {/* Empty state */}
        {watchHistory.length === 0 ? (
          <div style={S.empty}>
            <span style={S.emptyIcon}>📜</span>
            <h3 style={S.emptyTitle}>Your watch history is empty</h3>
            <p style={S.emptySubtitle}>Videos you watch will appear here</p>
            <Link to="/" style={S.browseBtn}>Browse Videos</Link>
          </div>
        ) : (
          <div style={S.groupList}>
            {Object.entries(grouped).map(([date, videos]) => (
              <div key={date} style={S.group}>
                <h2 style={S.groupTitle}>{date}</h2>
                <div style={S.grid}>
                  {videos.map(video => (
                    <div key={video.id} className="hist-item-wrap" style={S.itemWrap}>
                      <VideoCard video={video} />
                      <button
                        className="hist-remove-btn"
                        style={S.removeBtn}
                        onClick={() => removeFromHistory(video.id)}
                        title="Remove from history"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  )
}

const css = `
  .hist-clear-btn:hover  { background: #ff4444 !important; color: #fff !important; }
  .hist-remove-btn       { opacity: 0; transition: opacity 0.2s; }
  .hist-item-wrap:hover .hist-remove-btn { opacity: 1; }
  .hist-remove-btn:hover { background: #ff4444 !important; }
  .hist-browse-btn:hover { background: #cc0000 !important; }
`

const S = {
  page: {
    maxWidth: 1440,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    paddingBottom: 16,
    borderBottom: '1px solid #1a1a1a',
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: '#fff',
  },
  clearBtn: {
    padding: '8px 20px',
    background: '#1a1a1a',
    color: '#ff6b6b',
    border: '1.5px solid #ff4444',
    borderRadius: 22,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    background: '#111',
    borderRadius: 16,
  },
  emptyIcon: {
    fontSize: 72,
    display: 'block',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 28,
  },
  browseBtn: {
    display: 'inline-block',
    padding: '12px 32px',
    background: '#ff0000',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 28,
    fontSize: 16,
    fontWeight: 800,
    transition: 'background 0.2s',
  },
  groupList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 36,
  },
  group: {},
  groupTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#555',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottom: '1px solid #1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px 16px',
  },
  itemWrap: {
    position: 'relative',
  },
  removeBtn: {
    position: 'absolute',
    top: 8, right: 8,
    width: 30, height: 30,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.85)',
    color: '#fff',
    border: 'none',
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    transition: 'background 0.15s',
  },
}