// components/SearchSuggestions.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchHistory } from '../context/SearchHistoryContext'

export default function SearchSuggestions({ 
  query, 
  onSelect, 
  onClose,
  suggestions = [] 
}) {
  const navigate = useNavigate()
  const { searchHistory, removeFromSearchHistory, getPopularSearches } = useSearchHistory()
  const [activeIndex, setActiveIndex] = useState(-1)
  const [showHistory, setShowHistory] = useState(true)

  const recentSearches = getPopularSearches(5)
  const filteredSuggestions = query 
    ? suggestions.filter(s => 
        s.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : []

  const handleKeyDown = (e) => {
    const items = query ? filteredSuggestions : recentSearches
    if (items.length === 0) return

    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (prev + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => (prev - 1 + items.length) % items.length)
        break
      case 'Enter':
        if (activeIndex >= 0) {
          handleSelect(items[activeIndex])
        }
        break
      case 'Escape':
        onClose()
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [query, suggestions, activeIndex])

  const handleSelect = (searchTerm) => {
    onSelect(searchTerm)
    navigate(`/?search=${encodeURIComponent(searchTerm)}`)
    onClose()
  }

  const handleRemoveHistory = (e, searchId) => {
    e.stopPropagation()
    removeFromSearchHistory(searchId)
  }

  if (!query && searchHistory.length === 0) return null

  return (
    <div style={styles.container}>
      {/* Search suggestions or history */}
      {query ? (
        // Live search suggestions
        filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              style={{
                ...styles.suggestionItem,
                backgroundColor: index === activeIndex ? '#3f3f3f' : 'transparent'
              }}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span style={styles.searchIcon}>🔍</span>
              <span style={styles.suggestionText}>{suggestion}</span>
            </div>
          ))
        ) : (
          <div style={styles.noResults}>
            <span style={styles.searchIcon}>🔍</span>
            <span>Search for "{query}"</span>
          </div>
        )
      ) : (
        // Search history
        <>
          <div style={styles.header}>
            <span style={styles.headerTitle}>Recent searches</span>
            {searchHistory.length > 0 && (
              <button 
                onClick={() => {
                  if (window.confirm('Clear all search history?')) {
                    localStorage.removeItem('searchHistory')
                    window.location.reload()
                  }
                }}
                style={styles.clearButton}
              >
                Clear all
              </button>
            )}
          </div>
          
          {searchHistory.slice(0, 5).map((item, index) => (
            <div
              key={item.id}
              style={{
                ...styles.suggestionItem,
                backgroundColor: index === activeIndex ? '#3f3f3f' : 'transparent'
              }}
              onClick={() => handleSelect(item.query)}
            >
              <span style={styles.historyIcon}>🕒</span>
              <span style={styles.suggestionText}>{item.query}</span>
              <button
                onClick={(e) => handleRemoveHistory(e, item.id)}
                style={styles.removeButton}
                title="Remove from history"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Popular searches */}
          {recentSearches.length > 0 && (
            <>
              <div style={styles.divider} />
              <div style={styles.popularSection}>
                <span style={styles.popularTitle}>Popular searches</span>
                <div style={styles.popularTags}>
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelect(term)}
                      style={styles.popularTag}
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
  )
}

const styles = {
  container: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#282828',
    border: '1px solid #3f3f3f',
    borderRadius: '12px',
    marginTop: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 1100,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    borderBottom: '1px solid #3f3f3f',
  },
  headerTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#aaa',
  },
  clearButton: {
    background: 'none',
    border: 'none',
    color: '#3ea6ff',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  suggestionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    position: 'relative',
  },
  searchIcon: {
    fontSize: '16px',
    color: '#aaa',
  },
  historyIcon: {
    fontSize: '16px',
    color: '#aaa',
  },
  suggestionText: {
    flex: 1,
    fontSize: '14px',
    color: 'white',
  },
  removeButton: {
    width: '24px',
    height: '24px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '50%',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  noResults: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    color: '#aaa',
    fontSize: '14px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#3f3f3f',
    margin: '8px 0',
  },
  popularSection: {
    padding: '12px 16px',
  },
  popularTitle: {
    display: 'block',
    fontSize: '12px',
    color: '#aaa',
    marginBottom: '10px',
  },
  popularTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  popularTag: {
    padding: '6px 12px',
    backgroundColor: '#3f3f3f',
    border: 'none',
    borderRadius: '16px',
    color: 'white',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
}

// Add hover styles
const style = document.createElement('style')
style.textContent = `
  .suggestion-item:hover {
    background-color: #3f3f3f !important;
  }
  .suggestion-item:hover .remove-button {
    display: flex !important;
  }
  .remove-button:hover {
    background-color: #ff4444 !important;
    color: white !important;
  }
  .clear-button:hover {
    text-decoration: underline !important;
  }
  .popular-tag:hover {
    background-color: #4f4f4f !important;
  }
`
document.head.appendChild(style)