// pages/Profile.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from '../context/HistoryContext'

const USER = {
  name:        'John Doe',
  handle:      '@johndoe_official',
  channel:     'John Doe Vlogs',
  subscribers: '1.24M',
  videos:      124,
  joined:      'January 2024',
  description: 'Creating awesome content about technology, travel, and lifestyle. Passionate about sharing knowledge and building a global community. New videos uploaded every single week — hit subscribe so you never miss one!',
  links: [
    '📅 Joined January 2024',
    '👥 1.24M subscribers',
    '🎥 124 videos uploaded',
    '🌍 Audience from 180+ countries',
    '📧 business@johndoe.com',
  ],
}

export default function Profile() {
  const { watchHistory } = useHistory()
  const [activeTab, setActiveTab] = useState('history')

  return (
    <>
      <style>{css}</style>
      <div style={S.page}>

        {/* Cover */}
        <div style={S.cover} />

        <div style={S.content}>
          {/* Header */}
          <div style={S.profileHeader}>
            <div style={S.avatar}>JD</div>
            <div style={S.info}>
              <h1 style={S.name}>{USER.name}</h1>
              <p style={S.handle}>{USER.handle}</p>
              <div style={S.statsRow}>
                <span style={S.stat}>{USER.subscribers} subscribers</span>
                <span style={S.statDot}>·</span>
                <span style={S.stat}>{USER.videos} videos</span>
                <span style={S.statDot}>·</span>
                <span style={S.stat}>Joined {USER.joined}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={S.tabs}>
            {[
              { key: 'history', label: 'Watch History' },
              { key: 'about',   label: 'About' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className="prof-tab"
                onClick={() => setActiveTab(key)}
                style={{
                  ...S.tab,
                  borderBottom: activeTab === key ? '2.5px solid #ff0000' : '2.5px solid transparent',
                  color:         activeTab === key ? '#fff' : '#555',
                  fontWeight:    activeTab === key ? 800 : 500,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* History tab */}
          {activeTab === 'history' && (
            watchHistory.length === 0 ? (
              <div style={S.emptyState}>
                <span style={S.emptyIcon}>📺</span>
                <h3 style={S.emptyTitle}>No watch history yet</h3>
                <p style={S.emptySubtitle}>Watch some videos and they'll appear here</p>
                <Link to="/" style={S.browseBtn}>Browse Videos</Link>
              </div>
            ) : (
              <div style={S.historyList}>
                {watchHistory.slice(0, 8).map(video => (
                  <Link key={video.id} to={`/watch/${video.id}`} className="prof-hist-item" style={S.historyItem}>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      style={S.historyThumb}
                      onError={e => { e.target.src = `https://picsum.photos/seed/${video.id}/320/180` }}
                    />
                    <div style={S.historyInfo}>
                      <h4 style={S.historyTitle}>{video.title}</h4>
                      <p style={S.historyChannel}>{video.channel}</p>
                      <p style={S.historyMeta}>{video.views} · {video.time}</p>
                    </div>
                  </Link>
                ))}
                {watchHistory.length > 8 && (
                  <Link to="/history" style={S.viewAllBtn}>
                    View all history →
                  </Link>
                )}
              </div>
            )
          )}

          {/* About tab */}
          {activeTab === 'about' && (
            <div style={S.aboutBox}>
              <p style={S.aboutText}>{USER.description}</p>
              <div style={S.detailList}>
                {USER.links.map(d => (
                  <div key={d} style={S.detailItem}>{d}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const css = `
  .prof-tab:hover          { background: rgba(255,255,255,0.05) !important; }
  .prof-hist-item:hover    { background: #1a1a1a !important; }
  .prof-browse-btn:hover   { background: #cc0000 !important; }
  .prof-view-all:hover     { background: #2a2a2a !important; }
`

const S = {
  page: {
    minHeight: '100vh',
  },
  cover: {
    height: 220,
    background: 'linear-gradient(135deg, #c0392b 0%, #7c3aed 50%, #1d4ed8 100%)',
    borderRadius: 18,
  },
  content: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 4px 48px',
  },
  profileHeader: {
    display: 'flex',
    gap: 26,
    marginTop: -80,
    marginBottom: 34,
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  avatar: {
    width: 140, height: 140,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3ea6ff, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 56,
    fontWeight: 900,
    border: '6px solid #0f0f0f',
    flexShrink: 0,
    color: '#fff',
  },
  info: {
    paddingBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: 900,
    color: '#fff',
    marginBottom: 4,
  },
  handle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  statsRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  stat: {
    fontSize: 13,
    color: '#717171',
  },
  statDot: {
    color: '#333',
    fontSize: 13,
  },
  tabs: {
    display: 'flex',
    gap: 4,
    borderBottom: '1px solid #1a1a1a',
    marginBottom: 28,
  },
  tab: {
    padding: '12px 28px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    transition: 'all 0.15s',
    borderRadius: '4px 4px 0 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#111',
    borderRadius: 16,
  },
  emptyIcon: {
    fontSize: 64,
    display: 'block',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
  },
  browseBtn: {
    display: 'inline-block',
    padding: '12px 30px',
    background: '#ff0000',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 28,
    fontSize: 15,
    fontWeight: 800,
    transition: 'background 0.2s',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  historyItem: {
    display: 'flex',
    gap: 18,
    background: '#111',
    border: '1px solid #1a1a1a',
    borderRadius: 16,
    padding: 16,
    textDecoration: 'none',
    color: '#fff',
    transition: 'background 0.15s',
  },
  historyThumb: {
    width: 180,
    aspectRatio: '16 / 9',
    borderRadius: 12,
    objectFit: 'cover',
    flexShrink: 0,
  },
  historyInfo: {
    flex: 1,
    minWidth: 0,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.5,
    marginBottom: 6,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  historyChannel: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 4,
  },
  historyMeta: {
    fontSize: 12,
    color: '#555',
  },
  viewAllBtn: {
    display: 'inline-block',
    padding: '10px 22px',
    background: '#1a1a1a',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 22,
    fontSize: 14,
    fontWeight: 600,
    transition: 'background 0.15s',
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  aboutBox: {
    background: '#111',
    borderRadius: 18,
    padding: '28px 30px',
    border: '1px solid #1a1a1a',
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 1.9,
    color: '#ccc',
    marginBottom: 28,
  },
  detailList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  detailItem: {
    fontSize: 14,
    color: '#717171',
  },
}