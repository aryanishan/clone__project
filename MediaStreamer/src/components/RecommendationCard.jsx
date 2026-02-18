// components/RecommendationCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function RecommendationCard({ video, compact = false }) {
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently'
    
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffInSeconds = Math.floor((now - date) / 1000)
      
      const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
      ]
      
      for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds)
        if (count >= 1) {
          return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
        }
      }
      return 'just now'
    } catch (e) {
      return 'Recently'
    }
  }

  // Use placeholder image if no thumbnail
  const thumbnailUrl = video.thumbnail || 'https://via.placeholder.com/320x180/2a2a2a/666666?text=No+Thumbnail'

  if (compact) {
    return (
      <Link to={`/watch/${video.id}`} style={styles.compactCard} className="recommendation-card">
        <div style={styles.compactThumbnail}>
          <img 
            src={thumbnailUrl} 
            alt={video.title}
            style={styles.compactThumbImg}
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/320x180/2a2a2a/666666?text=No+Thumbnail'
            }}
          />
          <span style={styles.duration}>10:30</span>
        </div>
        <div style={styles.compactInfo}>
          <h4 style={styles.compactTitle}>{video.title || 'Untitled Video'}</h4>
          <p style={styles.compactChannel}>{video.channel || 'Unknown Channel'}</p>
          <p style={styles.compactMeta}>
            {video.views || 'No views'} • {formatTimeAgo(video.time)}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/watch/${video.id}`} style={styles.card} className="recommendation-card">
      <div style={styles.thumbnail}>
        <img 
          src={thumbnailUrl} 
          alt={video.title}
          style={styles.thumbnailImg}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/320x180/2a2a2a/666666?text=No+Thumbnail'
          }}
        />
        <span style={styles.duration}>10:30</span>
      </div>
      <div style={styles.info}>
        <h4 style={styles.title}>{video.title || 'Untitled Video'}</h4>
        <p style={styles.channel}>{video.channel || 'Unknown Channel'}</p>
        <p style={styles.meta}>
          {video.views || 'No views'} • {formatTimeAgo(video.time)}
        </p>
      </div>
    </Link>
  )
}

const styles = {
  card: {
    display: 'flex',
    gap: '12px',
    textDecoration: 'none',
    color: 'white',
    marginBottom: '12px',
  },
  thumbnail: {
    position: 'relative',
    width: '168px',
    aspectRatio: '16/9',
    borderRadius: '8px',
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: '#1a1a1a',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.2s',
  },
  compactThumbnail: {
    position: 'relative',
    width: '120px',
    aspectRatio: '16/9',
    borderRadius: '6px',
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: '#1a1a1a',
  },
  compactThumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  duration: {
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: 'white',
    padding: '2px 4px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  compactInfo: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '4px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  compactTitle: {
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '2px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  channel: {
    fontSize: '12px',
    color: '#aaa',
    marginBottom: '2px',
  },
  compactChannel: {
    fontSize: '11px',
    color: '#aaa',
    marginBottom: '2px',
  },
  meta: {
    fontSize: '11px',
    color: '#666',
  },
  compactMeta: {
    fontSize: '10px',
    color: '#666',
  },
}

// Add hover effect
const style = document.createElement('style')
style.textContent = `
  .recommendation-card:hover .thumbnail-img {
    transform: scale(1.05);
  }
`
document.head.appendChild(style)