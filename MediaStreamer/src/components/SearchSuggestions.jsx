// components/SearchSuggestions.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchHistory } from '../context/SearchHistoryContext'

export default function SearchSuggestions({ query, onSelect, onClose }) {
  const navigate = useNavigate()
  const { searchHistory, removeFromSearchHistory, getPopularSearches } = useSearchHistory()
  const [activeIdx, setActiveIdx] = useState(-1)

  const filtered = query?.trim()
    ? searchHistory.filter(i => i.query.toLowerCase().includes(query.toLowerCase())).slice(0, 7)
    : searchHistory.slice(0, 7)

  const popular = getPopularSearches(5)

  useEffect(() => {
    const fn = (e) => {
      const items = filtered
      if (!items.length) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => (i + 1) % items.length) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => (i - 1 + items.length) % items.length) }
      if (e.key === 'Enter' && activeIdx >= 0) handleSelect(items[activeIdx].query)
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [filtered, activeIdx, onClose])

  const handleSelect = (q) => {
    onSelect(q)
    navigate(`/?search=${encodeURIComponent(q)}`)
    onClose()
  }

  if (!query && searchHistory.length === 0) return null

  return (
    <>
      <style>{css}</style>
      <div style={S.panel}>

        {query?.trim() ? (
          /* ── Filtered results ── */
          filtered.length > 0 ? (
            filtered.map((item, i) => (
              <div
                key={item.id}
                className="ss-item"
                style={{ ...S.item, background: i === activeIdx ? '#2a2a2a' : 'transparent' }}
                onClick={() => handleSelect(item.query)}
                onMouseEnter={() => setActiveIdx(i)}
              >
                <SearchIcon />
                <span style={S.itemText}>{item.query}</span>
              </div>
            ))
          ) : (
            <div style={S.noResult}>
              <SearchIcon />
              <span>Search for "{query}"</span>
            </div>
          )
        ) : (
          /* ── Recent + Popular ── */
          <>
            <div style={S.sectionHeader}>
              <span style={S.sectionLabel}>Recent searches</span>
              <button
                className="ss-clear-btn"
                style={S.clearBtn}
                onClick={() => { localStorage.removeItem('searchHistory'); window.location.reload() }}
              >
                Clear all
              </button>
            </div>

            {searchHistory.slice(0, 6).map((item, i) => (
              <div
                key={item.id}
                className="ss-item"
                style={{ ...S.item, background: i === activeIdx ? '#2a2a2a' : 'transparent' }}
                onClick={() => handleSelect(item.query)}
              >
                <ClockIcon />
                <span style={S.itemText}>{item.query}</span>
                <button
                  className="ss-remove-btn"
                  style={S.removeBtn}
                  onClick={e => { e.stopPropagation(); removeFromSearchHistory(item.id) }}
                >
                  ✕
                </button>
              </div>
            ))}

            {popular.length > 0 && (
              <>
                <div style={S.divider} />
                <div style={S.popularSection}>
                  <p style={S.popularLabel}>Trending</p>
                  <div style={S.popularTags}>
                    {popular.map((term, i) => (
                      <button
                        key={i}
                        className="ss-tag"
                        style={S.tag}
                        onClick={() => handleSelect(term)}
                      >
                        🔥 {term}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}

const css = `
  .ss-item:hover       { background: #2a2a2a !important; }
  .ss-item:hover .ss-remove-btn { display: flex !important; }
  .ss-remove-btn:hover { background: #ff4444 !important; color: #fff !important; }
  .ss-tag:hover        { background: #3a3a3a !important; }
  .ss-clear-btn:hover  { text-decoration: underline !important; }
`

const S = {
  panel: {
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
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px 6px',
    borderBottom: '1px solid #2a2a2a',
  },
  sectionLabel: {
    fontSize: 11,
    color: '#555',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#3ea6ff',
    fontSize: 12,
    cursor: 'pointer',
    fontWeight: 600,
    padding: '2px 6px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    cursor: 'pointer',
    transition: 'background 0.15s',
    color: '#aaa',
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  removeBtn: {
    display: 'none',
    width: 26, height: 26,
    background: 'transparent',
    border: 'none',
    color: '#555',
    cursor: 'pointer',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    transition: 'all 0.15s',
  },
  noResult: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px',
    color: '#aaa',
    fontSize: 14,
  },
  divider: {
    height: 1,
    background: '#2a2a2a',
    margin: '6px 0',
  },
  popularSection: {
    padding: '10px 16px 14px',
  },
  popularLabel: {
    fontSize: 11,
    color: '#555',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  popularTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    padding: '6px 14px',
    background: '#2a2a2a',
    border: 'none',
    borderRadius: 18,
    color: '#e0e0e0',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
}

function SearchIcon() { return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg> }
function ClockIcon()  { return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg> }