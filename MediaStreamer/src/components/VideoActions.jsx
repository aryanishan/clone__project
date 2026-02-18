// components/VideoActions.jsx
import React, { useState, useRef, useEffect } from 'react'

export default function VideoActions({ video }) {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareRef = useRef(null)

  useEffect(() => {
    const fn = (e) => { if (shareRef.current && !shareRef.current.contains(e.target)) setShowShare(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleLike = () => { setLiked(l => !l); if (disliked) setDisliked(false) }
  const handleDislike = () => { setDisliked(d => !d); if (liked) setLiked(false) }

  const handleShare = (platform) => {
    const url = window.location.href
    const title = video?.title || ''
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }).catch(() => {})
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      default: break
    }
    setShowShare(false)
  }

  const COLORS = ['#3ea6ff','#ff6b6b','#51cf66','#ffd43b','#cc5de8','#ff9f43']
  const avatarColor = COLORS[(video?.channel || '?').charCodeAt(0) % COLORS.length]

  return (
    <>
      <style>{css}</style>
      <div style={S.wrap}>

        {/* Channel row */}
        <div style={S.channelRow}>
          <div style={{ ...S.avatar, background: avatarColor }}>
            {(video?.channel || '?')[0].toUpperCase()}
          </div>
          <div>
            <p style={S.channelName}>{video?.channel || 'Unknown Channel'}</p>
            <p style={S.subs}>1.24M subscribers</p>
          </div>
          <button
            className="va-sub-btn"
            onClick={() => setSubscribed(s => !s)}
            style={{
              ...S.subBtn,
              background:  subscribed ? '#2a2a2a' : '#ff0000',
              border:      subscribed ? '1.5px solid #3a3a3a' : 'none',
            }}
          >
            {subscribed ? '✓ Subscribed' : 'Subscribe'}
          </button>
        </div>

        {/* Actions row */}
        <div style={S.actionsRow}>

          {/* Like / Dislike */}
          <div style={S.likeGroup}>
            <button
              className="va-action-btn"
              onClick={handleLike}
              style={{ ...S.actionBtn, ...S.likeBtnLeft, color: liked ? '#3ea6ff' : '#e0e0e0', background: liked ? '#1a2e42' : 'transparent' }}
            >
              <LikeIcon /> <span>{liked ? '12.1K' : '12K'}</span>
            </button>
            <div style={S.divider} />
            <button
              className="va-action-btn"
              onClick={handleDislike}
              style={{ ...S.actionBtn, ...S.dislikeBtnRight, color: disliked ? '#ff6b6b' : '#e0e0e0', background: disliked ? '#2a1515' : 'transparent' }}
            >
              <DislikeIcon />
            </button>
          </div>

          {/* Share */}
          <div ref={shareRef} style={{ position: 'relative' }}>
            <button
              className="va-action-btn va-share-btn"
              onClick={() => setShowShare(s => !s)}
              style={S.shareBtn}
            >
              <ShareIcon /> Share
            </button>
            {showShare && (
              <div style={S.shareMenu}>
                {[
                  { key: 'copy',      icon: '📋', label: copied ? 'Copied!' : 'Copy link' },
                  { key: 'twitter',   icon: '𝕏',  label: 'Twitter / X' },
                  { key: 'whatsapp',  icon: '💬', label: 'WhatsApp' },
                  { key: 'facebook',  icon: '📘', label: 'Facebook' },
                ].map(({ key, icon, label }) => (
                  <button
                    key={key}
                    className="va-share-item"
                    style={S.shareItem}
                    onClick={() => handleShare(key)}
                  >
                    <span>{icon}</span> {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* More */}
          <button className="va-action-btn" style={S.moreBtn} title="More actions">
            <MoreIcon />
          </button>

        </div>
      </div>
    </>
  )
}

const css = `
  .va-action-btn:hover  { background: #2e2e2e !important; }
  .va-sub-btn:hover     { filter: brightness(1.12); }
  .va-share-item:hover  { background: #2e2e2e !important; }
`

const S = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingBottom: 16,
    marginBottom: 16,
    borderBottom: '1px solid #1f1f1f',
  },
  channelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  avatar: {
    width: 46, height: 46,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 19,
    fontWeight: 800,
    flexShrink: 0,
    color: '#fff',
  },
  channelName: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 2,
    color: '#fff',
  },
  subs: {
    fontSize: 13,
    color: '#717171',
  },
  subBtn: {
    marginLeft: 'auto',
    padding: '9px 22px',
    borderRadius: 24,
    color: '#fff',
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: 116,
  },
  actionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  likeGroup: {
    display: 'flex',
    background: '#1a1a1a',
    borderRadius: 24,
    overflow: 'hidden',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '9px 16px',
    border: 'none',
    color: '#e0e0e0',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  likeBtnLeft: {
    borderRight: '1px solid #2a2a2a',
  },
  dislikeBtnRight: {
    padding: '9px 14px',
  },
  divider: {
    width: 1,
    background: '#2a2a2a',
    alignSelf: 'stretch',
  },
  shareBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '9px 18px',
    background: '#1a1a1a',
    border: 'none',
    borderRadius: 24,
    color: '#e0e0e0',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  shareMenu: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    left: 0,
    background: '#1e1e1e',
    border: '1px solid #2a2a2a',
    borderRadius: 14,
    padding: '6px 0',
    zIndex: 200,
    minWidth: 186,
    boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
  },
  shareItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '11px 18px',
    background: 'transparent',
    border: 'none',
    color: '#e0e0e0',
    fontSize: 14,
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  moreBtn: {
    width: 38, height: 38,
    background: '#1a1a1a',
    border: 'none',
    borderRadius: '50%',
    color: '#e0e0e0',
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s',
  },
}

function LikeIcon()    { return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg> }
function DislikeIcon() { return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg> }
function ShareIcon()   { return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg> }
function MoreIcon()    { return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg> }