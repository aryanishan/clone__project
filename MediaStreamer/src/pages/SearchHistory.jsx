// pages/SearchHistory.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSearchHistory } from '../context/SearchHistoryContext'

const GROUP_ORDER = ['Today', 'Yesterday', 'This Week', 'Older']

export default function SearchHistory() {
  const navigate = useNavigate()
  const { searchHistory, removeFromSearchHistory, clearSearchHistory, addToSearchHistory } = useSearchHistory()
  const [filter, setFilter] = useState('')

  const handleSearch = (query) => {
    addToSearchHistory(query)
    navigate(`/?search=${encodeURIComponent(query)}`)
  }

  const getGroupLabel = (timestamp) => {
    const date = new Date(timestamp)
    const now   = new Date()
    const todayStart     = new Date(now.setHours(0, 0, 0, 0))
    const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    const weekStart      = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 7)
    if (date >= todayStart)     return 'Today'
    if (date >= yesterdayStart) return 'Yesterday'
    if (date >= weekStart)      return 'This Week'
    return 'Older'
  }

  const formatTime = (ts) => {
    const date = new Date(ts)
    const diffH = (Date.now() - date) / 3600000
    return diffH < 24
      ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const filtered = filter.trim()
    ? searchHistory.filter(i => i.query.toLowerCase().includes(filter.toLowerCase()))
    : null

  const grouped = searchHistory.reduce((acc, item) => {
    const label = getGroupLabel(item.timestamp)
    if (!acc[label]) acc[label] = []
    acc[label].push(item)
    return acc
  }, {})

  const stats = [
    { label: 'Total Searches',  value: searchHistory.length },
    { label: 'Unique Queries',  value: new Set(searchHistory.map(s => s.query)).size },
    { label: 'Last 24h',        value: searchHistory.filter(s => new Date(s.timestamp) > new Date(Date.now() - 86400000)).length },
    { label: 'Avg Query Length',value: Math.round(searchHistory.reduce((a, s) => a + s.query.length, 0) / searchHistory.length) || 0 },
  ]

  return (
    <>
      <style>{css}</style>
      <div style={S.page}>

        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Search History</h1>
            <p style={S.subtitle}>
              {searchHistory.length} {searchHistory.length === 1 ? 'search' : 'searches'}
            </p>
          </div>
          <div style={S.headerActions}>
            <Link to="/" style={S.browseBtn}>Browse Videos</Link>
            {searchHistory.length > 0 && (
              <button className="sh-clear-btn" style={S.clearBtn} onClick={clearSearchHistory}>
                Clear History
              </button>
            )}
          </div>
        </div>

        {/* Filter input */}
        <div className="sh-filter-wrap" style={S.filterWrap}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Filter search history…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={S.filterInput}
          />
          {filter && (
            <button className="sh-clear-filter" style={S.clearFilter} onClick={() => setFilter('')}>✕</button>
          )}
        </div>

        {/* Empty state */}
        {searchHistory.length === 0 ? (
          <div style={S.empty}>
            <span style={S.emptyIcon}>🔍</span>
            <h3 style={S.emptyTitle}>Your search history is empty</h3>
            <p style={S.emptySubtitle}>Searches you perform will appear here</p>
            <Link to="/" style={S.startBtn}>Start Browsing</Link>
          </div>
        ) : (
          <>
            {/* Filtered view */}
            {filtered ? (
              filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#555' }}>
                  No matches for "{filter}"
                  <button className="sh-reset-btn" style={S.resetBtn} onClick={() => setFilter('')}>
                    Clear filter
                  </button>
                </div>
              ) : (
                <div style={S.itemList}>
                  {filtered.map(item => (
                    <HistoryRow key={item.id} item={item} onSearch={handleSearch} onRemove={removeFromSearchHistory} formatTime={formatTime} />
                  ))}
                </div>
              )
            ) : (
              /* Grouped view */
              GROUP_ORDER.map(group => {
                const items = grouped[group]
                if (!items?.length) return null
                return (
                  <div key={group} style={S.group}>
                    <h2 style={S.groupTitle}>{group}</h2>
                    <div style={S.itemList}>
                      {items.map(item => (
                        <HistoryRow key={item.id} item={item} onSearch={handleSearch} onRemove={removeFromSearchHistory} formatTime={formatTime} />
                      ))}
                    </div>
                  </div>
                )
              })
            )}

            {/* Stats */}
            <div style={S.statsPanel}>
              <h3 style={S.statsTitle}>📊 Search Insights</h3>
              <div style={S.statsGrid}>
                {stats.map(({ label, value }) => (
                  <div key={label} style={S.statCard}>
                    <span style={S.statValue}>{value}</span>
                    <span style={S.statLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </>
  )
}

function HistoryRow({ item, onSearch, onRemove, formatTime }) {
  return (
    <div className="sh-row" style={S.row}>
      <div style={S.rowLeft}>
        <ClockIcon />
        <button className="sh-query-btn" style={S.queryBtn} onClick={() => onSearch(item.query)}>
          {item.query}
        </button>
        <span style={S.rowTime}>{formatTime(item.timestamp)}</span>
      </div>
      <div style={S.rowRight}>
        <button className="sh-search-again" style={S.searchAgainBtn} onClick={() => onSearch(item.query)} title="Search again">
          <SearchIcon size={14} />
        </button>
        <button className="sh-remove-btn" style={S.removeBtn} onClick={() => onRemove(item.id)} title="Remove">
          ✕
        </button>
      </div>
    </div>
  )
}

// ── CSS ────────────────────────────────────────────────────────────────────────
const css = `
  .sh-clear-btn:hover    { background: #ff4444 !important; color: #fff !important; }
  .sh-filter-wrap:focus-within { border-color: #3ea6ff !important; }
  .sh-clear-filter:hover { background: #3a3a3a !important; color: #fff !important; }
  .sh-row:hover          { background: #181818 !important; }
  .sh-row:hover .sh-remove-btn { opacity: 1 !important; }
  .sh-remove-btn:hover   { background: #ff4444 !important; color: #fff !important; }
  .sh-search-again:hover { background: #3a3a3a !important; }
  .sh-query-btn:hover    { color: #3ea6ff !important; text-decoration: underline; }
  .sh-reset-btn          { display: block; margin: 16px auto 0; padding: 8px 20px; background: #1a1a1a; border: none; color: #fff; border-radius: 22px; cursor: pointer; font-size: 13px; }
  .sh-reset-btn:hover    { background: #2a2a2a !important; }
  .hist-browse-btn:hover { background: #1a1a1a !important; }
  .sh-start-btn:hover    { background: #cc0000 !important; }
`

// ── Styles ─────────────────────────────────────────────────────────────────────
const S = {
  page: {
    maxWidth: 900,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  headerActions: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  browseBtn: {
    padding: '8px 18px',
    background: '#1a1a1a',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 22,
    fontSize: 14,
    fontWeight: 600,
    transition: 'background 0.15s',
  },
  clearBtn: {
    padding: '8px 18px',
    background: '#1a1a1a',
    color: '#ff6b6b',
    border: '1.5px solid #ff4444',
    borderRadius: 22,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#111',
    border: '1.5px solid #222',
    borderRadius: 28,
    padding: '11px 18px',
    marginBottom: 24,
    transition: 'border-color 0.2s',
    color: '#555',
  },
  filterInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
  },
  clearFilter: {
    background: 'transparent',
    border: 'none',
    color: '#555',
    cursor: 'pointer',
    width: 26, height: 26,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    transition: 'all 0.15s',
  },
  empty: {
    textAlign: 'center',
    padding: '70px 20px',
    background: '#111',
    borderRadius: 18,
  },
  emptyIcon: {
    fontSize: 64,
    display: 'block',
    marginBottom: 18,
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
    marginBottom: 26,
  },
  startBtn: {
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
  group: {
    marginBottom: 26,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#444',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: '1px solid #1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#111',
    borderRadius: 12,
    transition: 'background 0.15s',
  },
  rowLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
    color: '#555',
  },
  queryBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    textAlign: 'left',
    cursor: 'pointer',
    padding: 0,
    transition: 'color 0.15s',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowTime: {
    fontSize: 12,
    color: '#444',
    flexShrink: 0,
  },
  rowRight: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    marginLeft: 12,
  },
  searchAgainBtn: {
    width: 30, height: 30,
    background: '#1a1a1a',
    border: 'none',
    borderRadius: '50%',
    color: '#aaa',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s',
  },
  removeBtn: {
    width: 30, height: 30,
    background: '#1a1a1a',
    border: 'none',
    borderRadius: '50%',
    color: '#ff6b6b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    opacity: 0,
    transition: 'all 0.15s',
  },
  statsPanel: {
    marginTop: 40,
    padding: '26px',
    background: '#111',
    borderRadius: 18,
    border: '1px solid #1a1a1a',
  },
  statsTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 18,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 14,
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '18px 20px',
    background: '#0d0d0d',
    borderRadius: 14,
    border: '1px solid #1a1a1a',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 900,
    color: '#ff0000',
  },
  statLabel: {
    fontSize: 12,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resetBtn: {},
}

function SearchIcon({ size = 16 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
}
function ClockIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
}