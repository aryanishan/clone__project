// pages/Home.jsx
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchTrending, searchVideos } from '../lib/api'
import VideoCard from '../components/VideoCard'

export default function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('search')
  
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [nextPageToken, setNextPageToken] = useState('')

  // Load videos
  useEffect(() => {
    let mounted = true
    
    const loadVideos = async () => {
      setLoading(true)
      setError(null)
      
      try {
        let results
        let token = ''
        
        if (query) {
          const data = await searchVideos(query, 12)
          results = data.videos || data
          token = data.nextPageToken || ''
        } else {
          const data = await fetchTrending(12)
          results = data.videos || data
          token = data.nextPageToken || ''
        }
        
        if (mounted) {
          // Ensure results is always an array
          const videoArray = Array.isArray(results) ? results : []
          setVideos(videoArray)
          setNextPageToken(token)
          setHasMore(!!token || videoArray.length === 12)
        }
      } catch (err) {
        console.error('Failed to load videos:', err)
        if (mounted) {
          setError('Failed to load videos. Please try again.')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadVideos()
    
    return () => {
      mounted = false
    }
  }, [query])

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    // Trigger re-fetch by forcing a re-render
    setPage(prev => prev + 1)
  }

  const loadMore = async () => {
    if (loadingMore || !hasMore || !nextPageToken) return
    
    setLoadingMore(true)
    try {
      let moreResults
      let token = ''
      
      if (query) {
        const data = await searchVideos(query, 12, nextPageToken)
        moreResults = data.videos || data
        token = data.nextPageToken || ''
      } else {
        const data = await fetchTrending(12, nextPageToken)
        moreResults = data.videos || data
        token = data.nextPageToken || ''
      }
      
      const moreArray = Array.isArray(moreResults) ? moreResults : []
      
      if (moreArray.length > 0) {
        setVideos(prev => [...prev, ...moreArray])
        setNextPageToken(token)
        setHasMore(!!token)
        setPage(prev => prev + 1)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Failed to load more videos:', err)
      setHasMore(false)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* Search header */}
      {query && !loading && (
        <p style={styles.searchHeader}>
          Search results for "{query}"
        </p>
      )}

      {/* Error message with retry button */}
      {error && (
        <div style={styles.errorContainer}>
          <span style={styles.errorIcon}>😕</span>
          <p style={styles.errorText}>{error}</p>
          <button onClick={handleRetry} style={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      {/* Video grid */}
      {!error && (
        <>
          <div style={styles.grid}>
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {/* Loading states */}
          {loading && (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Loading videos...</p>
            </div>
          )}

          {/* Load More Button */}
          {!loading && hasMore && videos.length > 0 && (
            <div style={styles.loadMoreContainer}>
              <button 
                onClick={loadMore}
                disabled={loadingMore}
                style={{
                  ...styles.loadMoreButton,
                  opacity: loadingMore ? 0.7 : 1,
                  cursor: loadingMore ? 'not-allowed' : 'pointer'
                }}
              >
                {loadingMore ? 'Loading...' : 'Load More Videos'}
              </button>
            </div>
          )}

          {/* No results */}
          {!loading && videos.length === 0 && !error && (
            <div style={styles.noResults}>
              <span style={styles.noResultsIcon}>🔍</span>
              <p style={styles.noResultsText}>No videos found</p>
              {query && (
                <p style={styles.noResultsSubtext}>
                  Try different keywords or check back later
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  searchHeader: {
    marginBottom: '20px',
    color: '#aaa',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px 16px',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    margin: '20px 0',
  },
  errorIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  errorText: {
    fontSize: '16px',
    color: '#ff4444',
    marginBottom: '20px',
  },
  retryButton: {
    padding: '12px 32px',
    backgroundColor: '#ff0000',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #303030',
    borderTopColor: '#ff0000',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    color: '#aaa',
    fontSize: '14px',
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '30px 20px',
  },
  loadMoreButton: {
    padding: '12px 40px',
    backgroundColor: '#272727',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  noResults: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  noResultsIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
    opacity: 0.5,
  },
  noResultsText: {
    fontSize: '18px',
    color: 'white',
    marginBottom: '8px',
  },
  noResultsSubtext: {
    fontSize: '14px',
    color: '#666',
  },
}

// Add global styles
const style = document.createElement('style')
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .retry-button:hover {
    background-color: #cc0000 !important;
  }
  
  .load-more-button:hover {
    background-color: #3f3f3f !important;
  }
`
document.head.appendChild(style)