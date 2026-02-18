// pages/Home.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchTrending, searchVideos } from '../lib/api'
import VideoCard from '../components/VideoCard'

export default function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('search')
  
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [nextPageToken, setNextPageToken] = useState('')
  const [error, setError] = useState(null)

  // Reset when query changes
  useEffect(() => {
    setVideos([])
    setNextPageToken('')
    setHasMore(true)
    setError(null)
  }, [query])

  // Load initial videos
  useEffect(() => {
    let mounted = true
    
    const loadInitialVideos = async () => {
      setLoading(true)
      setError(null)
      try {
        let results, newPageToken
        
        if (query) {
          // For search, we need to handle differently
          const data = await searchVideos(query, 12)
          results = data.videos || data
          newPageToken = data.nextPageToken || ''
        } else {
          // For trending
          const data = await fetchTrending(12)
          results = data.videos || data
          newPageToken = data.nextPageToken || ''
        }
        
        if (mounted) {
          // Remove duplicates by ID
          const uniqueVideos = results.filter((video, index, self) => 
            index === self.findIndex(v => v.id === video.id)
          )
          
          setVideos(uniqueVideos)
          setNextPageToken(newPageToken)
          setHasMore(!!newPageToken && uniqueVideos.length > 0)
        }
      } catch (error) {
        console.error('Failed to load videos:', error)
        if (mounted) {
          setError('Failed to load videos. Please try again.')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadInitialVideos()
    return () => { mounted = false }
  }, [query])

  // Load more videos
  const loadMore = async () => {
    if (loadingMore || !hasMore || !nextPageToken) return
    
    setLoadingMore(true)
    try {
      let results, newPageToken
      
      if (query) {
        // For search with pagination
        const data = await searchVideos(query, 12, nextPageToken)
        results = data.videos || data
        newPageToken = data.nextPageToken || ''
      } else {
        // For trending with pagination
        const data = await fetchTrending(12, nextPageToken)
        results = data.videos || data
        newPageToken = data.nextPageToken || ''
      }
      
      // Filter out videos that already exist (prevent duplicates)
      const existingIds = new Set(videos.map(v => v.id))
      const newUniqueVideos = results.filter(video => !existingIds.has(video.id))
      
      if (newUniqueVideos.length > 0) {
        setVideos(prev => [...prev, ...newUniqueVideos])
      }
      
      setNextPageToken(newPageToken)
      setHasMore(!!newPageToken && newUniqueVideos.length > 0)
      
    } catch (error) {
      console.error('Failed to load more videos:', error)
      setError('Failed to load more videos.')
    } finally {
      setLoadingMore(false)
    }
  }

  // Infinite scroll observer
  const observer = useRef()
  const lastVideoElementRef = useCallback(node => {
    if (loadingMore) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore()
      }
    })
    if (node) observer.current.observe(node)
  }, [loadingMore, hasMore, loadMore])

  return (
    <div>
      {/* Search header */}
      {query && !loading && (
        <p style={styles.searchHeader}>
          Search results for "{query}"
        </p>
      )}

      {/* Error message */}
      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}

      {/* Video grid */}
      <div style={styles.grid}>
        {videos.map(video => (
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

      {/* Infinite Scroll Sentinel */}
      {!loading && hasMore && (
        <div ref={lastVideoElementRef} style={styles.loadMoreContainer}>
            {loadingMore ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa' }}>
                <span style={styles.buttonSpinner}></span>
                <span>Loading more...</span>
              </div>
            ) : (
              <div style={{ height: '20px', width: '100%' }} />
            )}
        </div>
      )}

      {/* No more videos message */}
      {!loading && !hasMore && videos.length > 0 && (
        <p style={styles.endMessage}>
          You've seen all videos! Check back later for more.
        </p>
      )}

      {/* No results */}
      {!loading && videos.length === 0 && !error && (
        <div style={styles.noResults}>
          <p style={styles.noResultsText}>No videos found</p>
          {query && (
            <p style={styles.noResultsSubtext}>
              Try different keywords or check back later
            </p>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  searchHeader: {
    marginBottom: '16px',
    color: '#aaa',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px 16px',
    marginBottom: '20px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    gap: '16px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #303030',
    borderTopColor: '#ff0000',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '12px 40px',
    backgroundColor: '#272727',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '200px',
  },
  buttonSpinner: {
    width: '18px',
    height: '18px',
    border: '2px solid #ffffff',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
  },
  endMessage: {
    textAlign: 'center',
    padding: '30px',
    color: '#666',
    fontSize: '14px',
    borderTop: '1px solid #303030',
    marginTop: '20px',
  },
  noResults: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  noResultsText: {
    fontSize: '18px',
    color: '#fff',
    marginBottom: '8px',
  },
  noResultsSubtext: {
    fontSize: '14px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    margin: '20px 0',
  },
  retryButton: {
    marginTop: '16px',
    padding: '8px 24px',
    backgroundColor: '#ff0000',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
}

// Add animation keyframes
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  button:hover:not(:disabled) {
    background-color: #3f3f3f !important;
  }
`
document.head.appendChild(styleSheet)