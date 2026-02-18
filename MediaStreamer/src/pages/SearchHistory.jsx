// pages/SearchHistory.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSearchHistory } from '../context/SearchHistoryContext'

export default function SearchHistory() {
  const navigate = useNavigate()
  const { searchHistory, removeFromSearchHistory, clearSearchHistory } = useSearchHistory()
  const [filter, setFilter] = useState('')

  // Group searches by date
  const groupSearchesByDate = () => {
    const groups = {}
    const now = new Date()
    const today = new Date(now.setHours(0,0,0,0))
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const thisWeek = new Date(today)
    thisWeek.setDate(thisWeek.getDate() - 7)

    searchHistory.forEach(item => {
      const date = new Date(item.timestamp)
      let group

      if (date >= today) {
        group = 'Today'
      } else if (date >= yesterday) {
        group = 'Yesterday'
      } else if (date >= thisWeek) {
        group = 'This Week'
      } else {
        group = 'Older'
      }

      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(item)
    })

    return groups
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const handleSearch = (query) => {
    navigate(`/?search=${encodeURIComponent(query)}`)
  }

  const filteredSearches = searchHistory.filter(item =>
    item.query.toLowerCase().includes(filter.toLowerCase())
  )

  const groupedSearches = groupSearchesByDate()

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Search History</h1>
          <p style={styles.subtitle}>
            {searchHistory.length} {searchHistory.length === 1 ? 'search' : 'searches'}
          </p>
        </div>
        
        <div style={styles.headerActions}>
          <Link to="/" style={styles.browseButton}>
            Browse Videos
          </Link>
          {searchHistory.length > 0 && (
            <button 
              onClick={() => {
                if (window.confirm('Clear all search history?')) {
                  clearSearchHistory()
                }
              }}
              style={styles.clearButton}
            >
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* Search Filter */}
      <div style={styles.filterContainer}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Filter search history..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.filterInput}
        />
        {filter && (
          <button 
            onClick={() => setFilter('')}
            style={styles.clearFilter}
          >
            ✕
          </button>
        )}
      </div>

      {/* Search History List */}
      {filteredSearches.length === 0 ? (
        <div style={styles.emptyState}>
          {filter ? (
            <>
              <span style={styles.emptyIcon}>🔍</span>
              <h3 style={styles.emptyTitle}>No matches found</h3>
              <p style={styles.emptyText}>Try different keywords</p>
              <button onClick={() => setFilter('')} style={styles.resetButton}>
                Clear filter
              </button>
            </>
          ) : (
            <>
              <span style={styles.emptyIcon}>🕒</span>
              <h3 style={styles.emptyTitle}>Your search history is empty</h3>
              <p style={styles.emptyText}>
                Searches you perform will appear here
              </p>
              <Link to="/" style={styles.startBrowsingButton}>
                Start Browsing
              </Link>
            </>
          )}
        </div>
      ) : (
        <div style={styles.historyList}>
          {Object.entries(groupedSearches).map(([group, items]) => (
            <div key={group} style={styles.group}>
              <h2 style={styles.groupTitle}>{group}</h2>
              <div style={styles.groupItems}>
                {items
                  .filter(item => item.query.toLowerCase().includes(filter.toLowerCase()))
                  .map(item => (
                    <div key={item.id} style={styles.historyItem}>
                      <div style={styles.itemMain}>
                        <span style={styles.itemIcon}>🕒</span>
                        <div style={styles.itemContent}>
                          <button
                            onClick={() => handleSearch(item.query)}
                            style={styles.itemQuery}
                          >
                            {item.query}
                          </button>
                          <span style={styles.itemTime}>
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <div style={styles.itemActions}>
                        <button
                          onClick={() => handleSearch(item.query)}
                          style={styles.searchAgainButton}
                          title="Search again"
                        >
                          🔍
                        </button>
                        <button
                          onClick={() => removeFromSearchHistory(item.id)}
                          style={styles.removeItemButton}
                          title="Remove from history"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Stats */}
      {searchHistory.length > 0 && (
        <div style={styles.stats}>
          <h3 style={styles.statsTitle}>Search Insights</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <span style={styles.statValue}>{searchHistory.length}</span>
              <span style={styles.statLabel}>Total Searches</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statValue}>
                {new Set(searchHistory.map(s => s.query)).size}
              </span>
              <span style={styles.statLabel}>Unique Searches</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statValue}>
                {searchHistory.filter(s => 
                  new Date(s.timestamp) > new Date(Date.now() - 24*60*60*1000)
                ).length}
              </span>
              <span style={styles.statLabel}>Last 24h</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statValue}>
                {Math.round(searchHistory.reduce((acc, s) => 
                  acc + s.query.length, 0) / searchHistory.length) || 0}
              </span>
              <span style={styles.statLabel}>Avg. Query Length</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#aaa',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  browseButton: {
    padding: '8px 20px',
    backgroundColor: '#272727',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  clearButton: {
    padding: '8px 20px',
    backgroundColor: '#272727',
    color: '#ff4444',
    border: '1px solid #ff4444',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterContainer: {
    position: 'relative',
    marginBottom: '24px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666',
    fontSize: '16px',
  },
  filterInput: {
    width: '100%',
    padding: '12px 40px 12px 40px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #303030',
    borderRadius: '30px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
  },
  clearFilter: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '14px',
    cursor: 'pointer',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '24px',
  },
  resetButton: {
    padding: '10px 24px',
    backgroundColor: '#272727',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  startBrowsingButton: {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#ff0000',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: '500',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  group: {
    marginBottom: '16px',
  },
  groupTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#aaa',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #303030',
  },
  groupItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    transition: 'background-color 0.2s',
  },
  itemMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  itemIcon: {
    fontSize: '16px',
    color: '#aaa',
  },
  itemContent: {
    flex: 1,
  },
  itemQuery: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontWeight: '500',
    textAlign: 'left',
    cursor: 'pointer',
    padding: 0,
    marginBottom: '4px',
  },
  itemTime: {
    fontSize: '12px',
    color: '#666',
  },
  itemActions: {
    display: 'flex',
    gap: '8px',
  },
  searchAgainButton: {
    width: '32px',
    height: '32px',
    backgroundColor: '#272727',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  removeItemButton: {
    width: '32px',
    height: '32px',
    backgroundColor: '#272727',
    border: 'none',
    borderRadius: '50%',
    color: '#ff4444',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  stats: {
    marginTop: '40px',
    padding: '24px',
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
  },
  statsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '16px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  statCard: {
    padding: '16px',
    backgroundColor: '#0f0f0f',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    border: '1px solid #303030',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ff0000',
  },
  statLabel: {
    fontSize: '13px',
    color: '#aaa',
  },
}

// Add hover styles
const style = document.createElement('style')
style.textContent = `
  .history-item:hover {
    background-color: #272727 !important;
  }
  .browse-button:hover,
  .reset-button:hover,
  .search-again-button:hover {
    background-color: #3f3f3f !important;
  }
  .clear-button:hover {
    background-color: #ff4444 !important;
    color: white !important;
  }
  .remove-item-button:hover {
    background-color: #ff4444 !important;
    color: white !important;
  }
  .start-browsing-button:hover {
    background-color: #cc0000 !important;
  }
  .clear-filter:hover {
    background-color: #3f3f3f !important;
    color: white !important;
  }
  .item-query:hover {
    text-decoration: underline !important;
    color: #3ea6ff !important;
  }
`
document.head.appendChild(style)