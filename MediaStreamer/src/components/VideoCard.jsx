// components/VideoCard.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function VideoCard({ video }) {
  const [imgError, setImgError] = useState(false)

  const thumbnail = imgError || !video.thumbnail
    ? `https://picsum.photos/seed/${video.id}/640/360`
    : video.thumbnail

  const COLORS = ['#3ea6ff','#ff6b6b','#51cf66','#ffd43b','#cc5de8','#ff9f43']
  const avatarColor = COLORS[(video.channel || '?').charCodeAt(0) % COLORS.length]

  return (
    <>
      <style>{css}</style>
      <Link to={`/watch/${video.id}`} className="vc-card" style={S.card}>

        {/* Thumbnail */}
        <div className="vc-thumb" style={S.thumb}>
          <img
            className="vc-thumb-img"
            src={thumbnail}
            alt={video.title}
            style={S.thumbImg}
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <div className="vc-play-ov" style={S.playOverlay}>
            <svg viewBox="0 0 24 24" width="36" height="36" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span style={S.duration}>{video.duration || '10:30'}</span>
        </div>

        {/* Info */}
        <div style={S.info}>
          <div style={{ ...S.avatar, background: avatarColor }}>
            {(video.channel || '?')[0].toUpperCase()}
          </div>
          <div style={S.details}>
            <p style={S.title}>{video.title}</p>
            <p style={S.channel}>{video.channel}</p>
            <p style={S.meta}>{video.views} · {video.time}</p>
          </div>
        </div>

      </Link>
    </>
  )
}

const css = `
  .vc-card:hover .vc-thumb-img { transform: scale(1.06) !important; }
  .vc-card:hover .vc-thumb      { border-radius: 0 !important; }
  .vc-card:hover .vc-play-ov    { opacity: 1 !important; }
`

const S = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
    color: '#fff',
    cursor: 'pointer',
    width: '100%',
  },
  thumb: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#181818',
    transition: 'border-radius 0.2s',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.32s ease',
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.28)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  duration: {
    position: 'absolute',
    bottom: 8, right: 8,
    background: 'rgba(0,0,0,0.87)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 4,
  },
  info: {
    display: 'flex',
    gap: 12,
  },
  avatar: {
    width: 36, height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
    color: '#fff',
  },
  details: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.4,
    marginBottom: 4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  channel: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: '#717171',
  },
}