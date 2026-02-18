// components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSearchHistory } from '../context/SearchHistoryContext'
import { useNotifications } from '../context/NotificationContext'
import NotificationDropdown from './NotificationDropdown'

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const [query, setQuery] = useState('')
  const [showSugg, setShowSugg] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const { searchHistory, addToSearchHistory, removeFromSearchHistory } = useSearchHistory()
  const { unreadCount } = useNotifications()

  const suggestions = query.trim()
    ? searchHistory.filter(i => i.query.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : searchHistory.slice(0, 6)

  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSugg(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const doSearch = (q) => {
    if (!q?.trim()) return
    addToSearchHistory(q.trim())
    navigate(`/?search=${encodeURIComponent(q.trim())}`)
    setShowSugg(false)
  }

  return (
    <>
      <style>{css}</style>
      <nav style={S.navbar}>

        {/* ── Left ── */}
        <div style={S.left}>
          <button className="nb-icon-btn" onClick={() => setSidebarOpen(o => !o)} style={S.iconBtn}>
            <MenuIcon />
          </button>
          <Link to="/" style={S.logo}>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="#ff0000">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            <span style={S.logoText}>Streamr</span>
          </Link>
        </div>

        {/* ── Search ── */}
        <div ref={searchRef} style={S.searchWrap}>
          <form
            onSubmit={e => { e.preventDefault(); doSearch(query) }}
            style={S.searchForm}
          >
            <input
              className="nb-search-input"
              type="text"
              placeholder="Search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setShowSugg(true)}
              style={S.searchInput}
            />
            <button type="submit" className="nb-search-btn" style={S.searchBtn}>
              <SearchIcon />
            </button>
          </form>

          {showSugg && suggestions.length > 0 && (
            <div style={S.dropdown}>
              <p style={S.dropLabel}>Recent searches</p>
              {suggestions.map(item => (
                <div
                  key={item.id}
                  className="nb-sugg-item"
                  style={S.suggItem}
                  onClick={() => { setQuery(item.query); doSearch(item.query) }}
                >
                  <ClockIcon />
                  <span style={{ flex: 1, fontSize: 14 }}>{item.query}</span>
                  <button
                    className="nb-remove-btn"
                    style={S.removeBtn}
                    onClick={e => { e.stopPropagation(); removeFromSearchHistory(item.id) }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right ── */}
        <div style={S.right}>
          <Link to="/upload" className="nb-icon-btn" style={S.iconBtn} title="Upload video">
            <UploadIcon />
          </Link>

          <div style={{ position: 'relative' }}>
            <button
              className="nb-icon-btn"
              style={{ ...S.iconBtn, position: 'relative' }}
              onClick={() => setShowNotif(n => !n)}
              title="Notifications"
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span style={S.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>
            {showNotif && <NotificationDropdown onClose={() => setShowNotif(false)} />}
          </div>

          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <div style={S.avatar}>JD</div>
          </Link>
        </div>

      </nav>
    </>
  )
}

// ── Inline CSS (hover states only) ─────────────────────────────────────────────
const css = `
  .nb-icon-btn:hover  { background: rgba(255,255,255,0.1) !important; }
  .nb-search-btn:hover{ background: #3a3a3a !important; }
  .nb-search-input:focus { border-color: #3ea6ff !important; outline: none; }
  .nb-sugg-item:hover { background: #2a2a2a !important; }
  .nb-remove-btn:hover{ background: #3f3f3f !important; color: #fff !important; }
`

// ── Styles ─────────────────────────────────────────────────────────────────────
const S = {
  navbar: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: 56,
    background: 'rgba(15,15,15,0.97)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #1f1f1f',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 16px',
    zIndex: 2000,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    minWidth: 200,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    width: 40, height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    textDecoration: 'none',
    color: '#fff',
    padding: '4px 6px',
    borderRadius: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  searchWrap: {
    flex: 1,
    maxWidth: 680,
    margin: '0 auto',
    position: 'relative',
  },
  searchForm: {
    display: 'flex',
  },
  searchInput: {
    flex: 1,
    height: 40,
    padding: '0 18px',
    background: '#0d0d0d',
    border: '1.5px solid #2a2a2a',
    borderRight: 'none',
    borderRadius: '22px 0 0 22px',
    color: '#fff',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  searchBtn: {
    width: 64, height: 40,
    background: '#1e1e1e',
    border: '1.5px solid #2a2a2a',
    borderLeft: 'none',
    borderRadius: '0 22px 22px 0',
    color: '#aaa',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s',
    flexShrink: 0,
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0, right: 0,
    background: '#181818',
    border: '1px solid #2e2e2e',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
    zIndex: 3000,
  },
  dropLabel: {
    padding: '10px 16px 6px',
    fontSize: 11,
    color: '#555',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    cursor: 'pointer',
    transition: 'background 0.15s',
    color: '#aaa',
  },
  removeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#555',
    cursor: 'pointer',
    width: 28, height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    transition: 'background 0.15s',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    minWidth: 200,
    justifyContent: 'flex-end',
  },
  badge: {
    position: 'absolute',
    top: 4, right: 4,
    minWidth: 18, height: 18,
    background: '#ff0000',
    borderRadius: 9,
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #0f0f0f',
    padding: '0 3px',
    color: '#fff',
  },
  avatar: {
    width: 34, height: 34,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3ea6ff, #7c3aed)',
    border: '2px solid #3ea6ff',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
  },
}

// ── SVG Icons ──────────────────────────────────────────────────────────────────
function MenuIcon() {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
}
function SearchIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
}
function BellIcon() {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
}
function UploadIcon() {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/></svg>
}
function ClockIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
}