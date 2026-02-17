// components/VideoCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video.id}`} style={styles.card}>
      <div style={styles.thumbnail}>
        <img 
          src={video.thumbnail} 
          alt={video.title}
          style={styles.thumbnailImg}
        />
      </div>
      <div style={styles.info}>
        <div style={styles.avatar}>
          {video.channel?.charAt(0)}
        </div>
        <div style={styles.details}>
          <h3 style={styles.title}>{video.title}</h3>
          <p style={styles.channel}>{video.channel}</p>
          <p style={styles.meta}>
            {video.views} • {video.time}
          </p>
        </div>
      </div>
    </Link>
  )
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
    color: 'white',
    cursor: 'pointer',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: '#222',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    display: 'flex',
    gap: '8px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#3ea6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '500',
    flexShrink: 0,
  },
  details: {
    flex: 1,
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
  channel: {
    fontSize: '12px',
    color: '#aaa',
    marginBottom: '2px',
  },
  meta: {
    fontSize: '12px',
    color: '#aaa',
  },
}