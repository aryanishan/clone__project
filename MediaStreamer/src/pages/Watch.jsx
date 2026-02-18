// pages/Watch.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getVideo, searchVideos, fetchTrending, getChannelVideos } from '../lib/api'
import { useHistory } from '../context/HistoryContext'
import RecommendationCard from '../components/RecommendationCard'
import VideoActions from '../components/VideoActions'
import Comments from '../components/Comments'

export default function Watch() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMore, setShowMore] = useState(false)
  
  const { addToHistory } = useHistory()

  useEffect(() => {
    let mounted = true
    
    const loadVideo = async () => {
      setLoading(true)
      try {
        // Fetch current video
        const videoData = await getVideo(id)
        if (!mounted || !videoData) return
        
        setVideo(videoData)
        addToHistory(videoData)
        
        // Load recommendations based on video title
        await loadRecommendations(videoData)
        
      } catch (error) {
        console.error('Failed to load video:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadVideo()
    
    // Scroll to top when video changes
    window.scrollTo(0, 0)
    
    return () => {
      mounted = false
    }
  }, [id])

  const loadRecommendations = async (currentVideo) => {
    try {
      let allRecommendations = []
      
      // 1. Try to get videos from same channel first
      if (currentVideo.channelId) {
        try {
          const channelVideosRaw = await getChannelVideos(currentVideo.channelId)
          const channelVideos = channelVideosRaw.filter(v => v.id !== currentVideo.id)
          allRecommendations = [...allRecommendations, ...channelVideos]
        } catch (error) {
          console.error('Failed to fetch channel videos:', error)
        }
      }

      // 2. Search by video title keywords
      if (allRecommendations.length < 10) {
        const keywords = currentVideo.title
          .split(' ')
          .filter(word => word.length > 3)
          .slice(0, 3)
          .join(' ')
        
        try {
          const searchData = await searchVideos(keywords, 8)
          const searchResults = searchData.videos || searchData
          const filtered = searchResults.filter(v => v.id !== currentVideo.id)
          allRecommendations = [...allRecommendations, ...filtered]
        } catch (error) {
          console.error('Failed to search videos:', error)
        }
      }

      // 3. Add trending videos as fallback
      if (allRecommendations.length < 15) {
        try {
          const trendingData = await fetchTrending(15)
          const trendingVideos = Array.isArray(trendingData) ? trendingData : (trendingData.videos || [])
          const filtered = trendingVideos.filter(v => v.id !== currentVideo.id)
          allRecommendations = [...allRecommendations, ...filtered]
        } catch (error) {
          console.error('Failed to fetch trending:', error)
        }
      }

      // Remove duplicates by ID
      const uniqueRecommendations = Array.from(
        new Map(allRecommendations.map(v => [v.id, v])).values()
      ).slice(0, 15)

      if (mounted) {
        setRecommendations(uniqueRecommendations)
      }

    } catch (error) {
      console.error('Failed to load recommendations:', error)
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading video...</p>
      </div>
    )
  }

  if (!video) {
    return (
      <div style={styles.errorContainer}>
        <span style={styles.errorIcon}>😕</span>
        <h2 style={styles.errorTitle}>Video not found</h2>
        <p style={styles.errorText}>The video you're looking for doesn't exist or has been removed.</p>
        <Link to="/" style={styles.homeButton}>
          Go back home
        </Link>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Video Player */}
        <div style={styles.playerContainer}>
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            title={video.title}
            style={styles.player}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Info */}
        <div style={styles.videoInfo}>
          <h1 style={styles.videoTitle}>{video.title}</h1>
          
          {/* Video Stats and Actions */}
          <VideoActions video={video} />

          {/* Video Description */}
          <div style={styles.description}>
            <div style={styles.descriptionStats}>
              <span>{video.views || 'No views'}</span>
              <span>•</span>
              <span>{video.time || 'Recently'}</span>
            </div>
            <div style={{
              ...styles.descriptionText,
              maxHeight: showMore ? 'none' : '100px'
            }}>
              {video.description || 'No description available.'}
            </div>
            {video.description?.length > 200 && (
              <button 
                onClick={() => setShowMore(!showMore)}
                style={styles.showMoreButton}
              >
                {showMore ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <Comments videoId={id} />
      </div>

      {/* Sidebar - Recommendations */}
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>Recommended for you</h3>
        
        {/* Recommendations List */}
        <div style={styles.recommendationsList}>
          {recommendations.length > 0 ? (
            recommendations.map((recVideo, index) => (
              <RecommendationCard 
                key={recVideo.id || index} 
                video={recVideo} 
                compact 
              />
            ))
          ) : (
            // Show skeleton loading if no recommendations yet
            Array(8).fill(0).map((_, i) => (
              <div key={i} style={styles.skeletonCard}>
                <div style={styles.skeletonThumb}></div>
                <div style={styles.skeletonInfo}>
                  <div style={styles.skeletonLine}></div>
                  <div style={styles.skeletonLineShort}></div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Autoplay toggle */}
        <div style={styles.autoplayContainer}>
          <div style={styles.autoplayInfo}>
            <span style={styles.autoplayIcon}>🔁</span>
            <span style={styles.autoplayText}>Autoplay next video</span>
          </div>
          <label style={styles.switch}>
            <input type="checkbox" defaultChecked style={styles.switchInput} />
            <span style={styles.slider}></span>
          </label>
        </div>

        {/* Trending Now Section */}
        {recommendations.length > 0 && (
          <div style={styles.trendingSection}>
            <h4 style={styles.trendingTitle}>Trending now</h4>
            <div style={styles.trendingList}>
              {recommendations.slice(0, 3).map((rec, i) => (
                <div key={i} style={styles.trendingItem}>
                  <span style={styles.trendingNumber}>{i + 1}</span>
                  <div style={styles.trendingContent}>
                    <p style={styles.trendingName}>{rec.channel}</p>
                    <p style={styles.trendingViews}>{rec.views}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    gap: '24px',
    maxWidth: '1600px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#0f0f0f',
    minHeight: '100vh',
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
  },
  playerContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: 'black',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
  player: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  videoInfo: {
    marginBottom: '24px',
  },
  videoTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
    lineHeight: '1.4',
  },
  description: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px',
  },
  descriptionStats: {
    display: 'flex',
    gap: '8px',
    color: '#aaa',
    fontSize: '13px',
    marginBottom: '12px',
  },
  descriptionText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#ddd',
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
  },
  showMoreButton: {
    background: 'none',
    border: 'none',
    color: '#aaa',
    fontSize: '13px',
    fontWeight: '500',
    marginTop: '12px',
    cursor: 'pointer',
    padding: '4px 0',
  },
  sidebar: {
    width: '400px',
    flexShrink: 0,
  },
  sidebarTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: 'white',
  },
  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: 'calc(100vh - 300px)',
    overflowY: 'auto',
    paddingRight: '8px',
    marginBottom: '16px',
  },
  skeletonCard: {
    display: 'flex',
    gap: '12px',
    padding: '8px',
  },
  skeletonThumb: {
    width: '120px',
    height: '68px',
    backgroundColor: '#2a2a2a',
    borderRadius: '6px',
    animation: 'pulse 1.5s infinite',
  },
  skeletonInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  skeletonLine: {
    height: '12px',
    backgroundColor: '#2a2a2a',
    borderRadius: '4px',
    width: '100%',
    animation: 'pulse 1.5s infinite',
  },
  skeletonLineShort: {
    height: '12px',
    backgroundColor: '#2a2a2a',
    borderRadius: '4px',
    width: '60%',
    animation: 'pulse 1.5s infinite',
  },
  autoplayContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderTop: '1px solid #303030',
    borderBottom: '1px solid #303030',
  },
  autoplayInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  autoplayIcon: {
    fontSize: '18px',
  },
  autoplayText: {
    fontSize: '14px',
    fontWeight: '500',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '40px',
    height: '20px',
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#3f3f3f',
    transition: '.2s',
    borderRadius: '20px',
  },
  trendingSection: {
    marginTop: '20px',
    padding: '16px 0',
  },
  trendingTitle: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '12px',
    color: 'white',
  },
  trendingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  trendingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '4px 0',
  },
  trendingNumber: {
    width: '24px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#ff0000',
  },
  trendingContent: {
    flex: 1,
  },
  trendingName: {
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '2px',
  },
  trendingViews: {
    fontSize: '11px',
    color: '#666',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
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
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    padding: '20px',
  },
  errorIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  errorText: {
    color: '#aaa',
    marginBottom: '24px',
    maxWidth: '400px',
  },
  homeButton: {
    padding: '12px 24px',
    backgroundColor: '#ff0000',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
}

// Add global styles
const style = document.createElement('style')
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
  
  .show-more-button:hover {
    color: white !important;
  }
  
  .recommendations-list::-webkit-scrollbar {
    width: 6px;
  }
  
  .recommendations-list::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .recommendations-list::-webkit-scrollbar-thumb {
    background: #3f3f3f;
    border-radius: 3px;
  }
  
  .recommendations-list::-webkit-scrollbar-thumb:hover {
    background: #4f4f4f;
  }
  
  .home-button:hover {
    background-color: #cc0000 !important;
  }
  
  input:checked + .slider {
    background-color: #ff0000;
  }
  
  input:checked + .slider:before {
    transform: translateX(20px);
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .2s;
    border-radius: 50%;
  }
`
document.head.appendChild(style)