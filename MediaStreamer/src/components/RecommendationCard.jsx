// components/RecommendationCard.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function RecommendationCard({ video }) {
  const [imgError, setImgError] = useState(false)

  const thumbnail = imgError || !video.thumbnail
    ? `https://picsum.photos/seed/${video.id}/320/180`
    : video.thumbnail

  const COLORS = ['#3ea6ff','#ff6b6b','#51cf66','#ffd43b','#cc5de8','#ff9f43']
  const avatarColor = COLORS[(video.channel || '?').charCodeAt(0) % COLORS.length]

  return (
    <>
      <style>{css}</style>
      <Link to={`/watch/${video.id}`} className="rc-card" style={S.card}>

        {/* Thumbnail */}
        <div style={S.thumbWrap}>
          <img
            src={thumbnail}
            alt={video.title}
            style={S.thumb}
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <span style={S.duration}>{video.duration || '10:30'}</span>
        </div>

        {/* Info */}
        <div style={S.info}>
          <p style={S.title}>{video.title}</p>
          <p style={S.channel}>{video.channel}</p>
          <p style={S.meta}>{video.views} · {video.time}</p>
        </div>

      </Link>
    </>
  )
}

const css = `
  .rc-card:hover { background: #1c1c1c !important; border-radius: 8px; }
  .rc-card:hover img { transform: scale(1.04) !important; }
`

const S = {
  card: {
    display: 'flex',
    gap: 10,
    textDecoration: 'none',
    color: '#fff',
    padding: '6px 8px',
    transition: 'background 0.15s',
    width: '100%',
  },
  thumbWrap: {
    position: 'relative',
    width: 168,
    minWidth: 168,
    aspectRatio: '16 / 9',
    borderRadius: 8,
    overflow: 'hidden',
    background: '#1a1a1a',
    flexShrink: 0,
  },
  thumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.28s ease',
  },
  duration: {
    position: 'absolute',
    bottom: 4, right: 4,
    background: 'rgba(0,0,0,0.87)',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 5px',
    borderRadius: 3,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.4,
    marginBottom: 5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  channel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 2,
  },
  meta: {
    fontSize: 11,
    color: '#717171',
  },
}