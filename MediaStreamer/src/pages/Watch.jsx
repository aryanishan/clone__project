// pages/Watch.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getVideo } from '../lib/api'
import { useHistory } from '../context/HistoryContext'
import { useNotifications } from '../context/NotificationContext'

export default function Watch() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToHistory } = useHistory()
  const { addNotification } = useNotifications()

  useEffect(() => {
    let mounted = true
    
    const loadVideo = async () => {
      setLoading(true)
      try {
        const videoData = await getVideo(id)
        if (mounted && videoData) {
          setVideo(videoData)
          // Save to history when video loads
          addToHistory(videoData)
        }
      } catch (error) {
        console.error('Failed to load video:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadVideo()
    return () => { mounted = false }
  }, [id, addToHistory])

  useEffect(() => {
    if (video) {
      addNotification({
        type: 'subscription',
        channel: video.channel,
        message: 'uploaded a new video',
        action: video.title,
        videoId: video.id,
        videoThumb: video.thumbnail,
        channelAvatar: video.channel?.charAt(0)
      })
    }
  }, [video, addNotification])

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (!video) {
    return (
      <div style={styles.errorContainer}>
        <h2>Video not found</h2>
        <Link to="/" style={styles.homeLink}>Go back home</Link>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Main Video Section */}
      <div style={styles.videoSection}>
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
        <div style={styles.infoSection}>
          <h1 style={styles.title}>{video.title}</h1>
          
          <div style={styles.metaBar}>
            <div style={styles.channelInfo}>
              <div style={styles.avatar}>
                {video.channel?.charAt(0)}
              </div>
              <div>
                <p style={styles.channelName}>{video.channel}</p>
                <p style={styles.stats}>{video.views} • {video.time}</p>
              </div>
            </div>
            
            <div style={styles.actions}>
              <button style={styles.actionButton}>
                <span style={styles.actionIcon}>👍</span>
                <span>Like</span>
              </button>
              <button style={styles.actionButton}>
                <span style={styles.actionIcon}>👎</span>
                <span>Dislike</span>
              </button>
              <button style={styles.actionButton}>
                <span style={styles.actionIcon}>↗️</span>
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div style={styles.description}>
            <p style={styles.descriptionText}>{video.description}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        <Link to="/" style={styles.backButton}>
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    color: 'white',
  },
  videoSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  playerContainer: {
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: 'black',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
  player: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    padding: '0 8px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    lineHeight: '1.4',
  },
  metaBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #303030',
    flexWrap: 'wrap',
    gap: '16px',
  },
  channelInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#3ea6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '600',
  },
  channelName: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '4px',
  },
  stats: {
    fontSize: '14px',
    color: '#aaa',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: '#272727',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  actionIcon: {
    fontSize: '18px',
  },
  description: {
    padding: '16px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    marginTop: '8px',
  },
  descriptionText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#e0e0e0',
    whiteSpace: 'pre-wrap',
  },
  navigation: {
    padding: '20px',
    borderTop: '1px solid #303030',
    marginTop: '20px',
  },
  backButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#272727',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
  },
  loading: {
    color: '#aaa',
    fontSize: '16px',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    color: 'white',
    gap: '20px',
  },
  homeLink: {
    color: '#3ea6ff',
    textDecoration: 'none',
    fontSize: '16px',
  },
}