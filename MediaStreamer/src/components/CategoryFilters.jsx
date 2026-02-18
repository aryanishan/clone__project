// components/CategoryFilters.jsx
import React, { useRef } from 'react'

export default function CategoryFilters({ categories, selectedCategory, onSelectCategory }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' })
  }

  return (
    <>
      <style>{css}</style>
      <div style={S.wrap}>

        <button className="cf-scroll-btn" style={{ ...S.scrollBtn, left: 0 }} onClick={() => scroll('left')}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <div ref={scrollRef} style={S.strip}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`cf-chip ${selectedCategory === cat ? 'cf-chip-active' : ''}`}
              style={{
                ...S.chip,
                background:  selectedCategory === cat ? '#fff' : '#272727',
                color:        selectedCategory === cat ? '#000' : '#fff',
                fontWeight:   selectedCategory === cat ? 700   : 500,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <button className="cf-scroll-btn" style={{ ...S.scrollBtn, right: 0, left: 'auto' }} onClick={() => scroll('right')}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>

      </div>
    </>
  )
}

const css = `
  .cf-scroll-btn:hover { opacity: 1 !important; background: #2a2a2a !important; }
  .cf-chip:hover:not(.cf-chip-active) { background: #3a3a3a !important; }
  .cf-chip-active:hover { background: #e0e0e0 !important; }
  .cf-strip::-webkit-scrollbar { display: none; }
`

const S = {
  wrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 22,
  },
  scrollBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 36, height: 36,
    borderRadius: '50%',
    background: '#0f0f0f',
    border: '1px solid #2a2a2a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    opacity: 0.75,
    transition: 'opacity 0.15s, background 0.15s',
  },
  strip: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    padding: '6px 44px',
    flex: 1,
  },
  chip: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: 22,
    fontSize: 14,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.15s',
  },
}