// pages/History.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from '../context/HistoryContext'
import VideoCard from '../components/VideoCard'

export default function History() {
  const { watchHistory, loading, clearHistory, removeFromHistory } = useHistory()

  const formatWatchedDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return 'Today'
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  // Group history by date
  const groupedHistory = watchHistory.reduce((groups, video) => {
    const date = formatWatchedDate(video.watchedAt)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(video)
    return groups
  }, {})

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading history...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Watch History</h1>
        {watchHistory.length > 0 && (
          <button onClick={clearHistory} style={styles.clearButton}>
            Clear All History
          </button>
        )}
      </div>

      {watchHistory.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyStateText}>Your watch history is empty</p>
          <p style={styles.emptyStateSubtext}>
            Videos you watch will appear here
          </p>
          <Link to="/" style={styles.browseButton}>
            Browse Videos
          </Link>
        </div>
      ) : (
        <div style={styles.historyList}>
          {Object.entries(groupedHistory).map(([date, videos]) => (
            <div key={date} style={styles.dateGroup}>
              <h2 style={styles.dateHeader}>{date}</h2>
              <div style={styles.videoGrid}>
                {videos.map(video => (
                  <div key={video.id} style={styles.videoItem}>
                    <VideoCard video={video} />
                    <button 
                      onClick={() => removeFromHistory(video.id)}
                      style={styles.removeButton}
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
  )
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '1px solid #303030',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'white',
  },
  clearButton: {
    padding: '8px 16px',
    backgroundColor: '#272727',
    color: '#ff4444',
    border: '1px solid #ff4444',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
  },
  emptyStateText: {
    fontSize: '20px',
    color: 'white',
    marginBottom: '10px',
  },
  emptyStateSubtext: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '30px',
  },
  browseButton: {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#ff0000',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  dateGroup: {
    marginBottom: '20px',
  },
  dateHeader: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#aaa',
    marginBottom: '15px',
    paddingBottom: '8px',
    borderBottom: '1px solid #303030',
  },
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px 16px',
  },
  videoItem: {
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  loading: {
    color: '#aaa',
    fontSize: '16px',
  },
}

// Add hover effect for remove button
const style = document.createElement('style')
style.textContent = `
  .video-item:hover .remove-button {
    opacity: 1 !important;
  }
  .remove-button:hover {
    background-color: #ff4444 !important;
  }
  .clear-button:hover {
    background-color: #ff4444 !important;
    color: white !important;
  }
  .browse-button:hover {
    background-color: #cc0000 !important;
  }
`
document.head.appendChild(style)