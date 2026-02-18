// components/NotificationDropdown.jsx
import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'

export default function NotificationDropdown({ onClose }) {
  const ref = useRef(null)
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, removeNotification } = useNotifications()

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [onClose])

  const handleClick = (n) => {
    if (!n.read) markAsRead(n.id)
    if (n.videoId) navigate(`/watch/${n.videoId}`)
    onClose()
  }

  const typeIcon = (type) => {
    switch (type) {
      case 'upload':       return '📹'
      case 'subscription': return '📺'
      case 'like':         return '👍'
      case 'comment':      return '💬'
      default:             return '🔔'
    }
  }

  return (
    <>
      <style>{css}</style>
      <div ref={ref} style={S.panel}>

        {/* Header */}
        <div style={S.header}>
          <h3 style={S.title}>Notifications</h3>
          <div style={S.headerActions}>
            {unreadCount > 0 && (
              <button className="nd-hbtn" style={S.hBtn} onClick={markAllAsRead}>
                ✓ Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button className="nd-hbtn nd-clear" style={{ ...S.hBtn, color: '#ff6b6b' }} onClick={clearAll}>
                Clear all
              </button>
            )}
            <button className="nd-close" style={S.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* List */}
        <div style={S.list}>
          {notifications.length === 0 ? (
            <div style={S.empty}>
              <span style={S.emptyIcon}>🔔</span>
              <p style={S.emptyTitle}>No notifications</p>
              <p style={S.emptySubtitle}>You're all caught up!</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className="nd-item"
                style={{ ...S.item, background: n.read ? 'transparent' : '#1a2535' }}
                onClick={() => handleClick(n)}
              >
                {/* Avatar / icon */}
                <div style={S.iconCol}>
                  {n.channelAvatar ? (
                    <div style={{ ...S.avatarCircle, background: avatarColor(n.channelAvatar) }}>
                      {n.channelAvatar}
                    </div>
                  ) : (
                    <span style={S.typeIcon}>{typeIcon(n.type)}</span>
                  )}
                </div>

                {/* Text */}
                <div style={S.textCol}>
                  <p style={S.message}>
                    <strong>{n.channel}</strong> {n.message}
                  </p>
                  {n.action && <p style={S.action}>{n.action}</p>}
                  <p style={S.time}>{n.time}</p>
                </div>

                {/* Thumb */}
                {n.videoThumb && (
                  <img src={n.videoThumb} alt="" style={S.thumb}
                    onError={e => { e.target.style.display = 'none' }} />
                )}

                {/* Unread dot */}
                {!n.read && <div style={S.dot} />}

                {/* Remove */}
                <button
                  className="nd-remove"
                  style={S.removeBtn}
                  onClick={e => { e.stopPropagation(); removeNotification(n.id) }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div style={S.footer}>
            <button style={S.viewAll} onClick={onClose}>View all notifications</button>
          </div>
        )}
      </div>
    </>
  )
}

const COLORS = ['#3ea6ff', '#ff6b6b', '#51cf66', '#ffd43b', '#cc5de8', '#ff9f43']
const avatarColor = (t) => COLORS[(t || '?').charCodeAt(0) % COLORS.length]

const css = `
  .nd-item:hover  { background: #252525 !important; }
  .nd-item:hover .nd-remove { display: flex !important; }
  .nd-remove:hover { background: #ff4444 !important; color: #fff !important; }
  .nd-hbtn:hover  { background: #3a3a3a !important; }
  .nd-close:hover { background: #3a3a3a !important; color: #fff !important; }
`

const S = {
  panel: {
    position: 'absolute',
    top: 48, right: 0,
    width: 390,
    maxHeight: 500,
    background: '#181818',
    border: '1px solid #2a2a2a',
    borderRadius: 16,
    boxShadow: '0 12px 48px rgba(0,0,0,0.8)',
    zIndex: 3000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    borderBottom: '1px solid #242424',
    flexShrink: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: 800,
    color: '#fff',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  hBtn: {
    padding: '4px 10px',
    background: '#2a2a2a',
    border: 'none',
    borderRadius: 6,
    color: '#aaa',
    fontSize: 12,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background 0.15s',
  },
  closeBtn: {
    width: 28, height: 28,
    background: '#2a2a2a',
    border: 'none',
    borderRadius: '50%',
    color: '#aaa',
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  list: {
    overflowY: 'auto',
    flex: 1,
  },
  item: {
    display: 'flex',
    gap: 12,
    padding: '13px 18px',
    cursor: 'pointer',
    borderBottom: '1px solid #1e1e1e',
    position: 'relative',
    transition: 'background 0.15s',
    alignItems: 'flex-start',
  },
  iconCol: {
    flexShrink: 0,
    width: 44, height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 44, height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 17,
    fontWeight: 800,
    color: '#fff',
  },
  typeIcon: {
    fontSize: 26,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  message: {
    fontSize: 13,
    color: '#e0e0e0',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  action: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
    color: '#555',
  },
  thumb: {
    width: 60,
    aspectRatio: '16/9',
    borderRadius: 6,
    objectFit: 'cover',
    flexShrink: 0,
  },
  dot: {
    position: 'absolute',
    top: 16, right: 16,
    width: 8, height: 8,
    borderRadius: '50%',
    background: '#3ea6ff',
  },
  removeBtn: {
    display: 'none',
    position: 'absolute',
    top: 8, right: 8,
    width: 22, height: 22,
    background: '#3a3a3a',
    border: 'none',
    borderRadius: '50%',
    color: '#aaa',
    fontSize: 11,
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  empty: {
    textAlign: 'center',
    padding: '44px 20px',
  },
  emptyIcon: {
    fontSize: 44,
    display: 'block',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 6,
    fontWeight: 600,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#555',
  },
  footer: {
    padding: '12px 18px',
    borderTop: '1px solid #242424',
    textAlign: 'center',
    flexShrink: 0,
  },
  viewAll: {
    background: 'none',
    border: 'none',
    color: '#3ea6ff',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
}