// components/CategoryFilters.jsx
import React, { useRef } from 'react'

export default function CategoryFilters({ categories, selectedCategory, onSelectCategory }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div style={styles.container}>
      <button 
        style={{...styles.scrollButton, ...styles.scrollLeft}}
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>

      <div style={styles.categories} ref={scrollRef}>
        {categories.map((category) => (
          <button
            key={category}
            style={{
              ...styles.categoryChip,
              ...(selectedCategory === category ? styles.categoryChipActive : {})
            }}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <button 
        style={{...styles.scrollButton, ...styles.scrollRight}}
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
    </div>
  )
}

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    padding: '0 24px',
  },
  categories: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    padding: '8px 0',
    flex: 1,
  },
  categoryChip: {
    padding: '8px 16px',
    backgroundColor: '#272727',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  categoryChipActive: {
    backgroundColor: 'white',
    color: 'black',
  },
  scrollButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#0f0f0f',
    border: '1px solid #303030',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  scrollLeft: {
    left: 0,
  },
  scrollRight: {
    right: 0,
  },
}
