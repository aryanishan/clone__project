// components/NotificationDropdown.jsx
import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'

export default function NotificationDropdown({ onClose }) {
  const dropdownRef = useRef(null)
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAll,
    removeNotification 
  } = useNotifications()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (notification.videoId) {
      // Navigate to video
      window.location.href = `/watch/${notification.videoId}`
    }
    onClose()
  }

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'subscription': return '📺'
      case 'like': return '👍'
      case 'comment': return '💬'
      case 'upload': return '📹'
      default: return '🔔'
    }
  }

  return (
    <div ref={dropdownRef} style={styles.dropdown}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Notifications</h3>
        <div style={styles.headerActions}>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} style={styles.headerButton} title="Mark all as read">
              ✓ All
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll} style={styles.headerButton} title="Clear all">
              ✕ All
            </button>
          )}
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>
      </div>

      {/* Notification List */}
      <div style={styles.notificationList}>
        {notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🔔</span>
            <p style={styles.emptyText}>No notifications</p>
            <p style={styles.emptySubtext}>You're all caught up!</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              style={{
                ...styles.notificationItem,
                backgroundColor: notification.read ? 'transparent' : '#272727'
              }}
              onClick={() => handleNotificationClick(notification)}
            >
              {/* Icon/Avatar */}
              <div style={styles.notificationIcon}>
                {notification.channelAvatar ? (
                  <div style={styles.channelAvatar}>
                    {notification.channelAvatar}
                  </div>
                ) : (
                  <span style={styles.iconEmoji}>
                    {getNotificationIcon(notification.type)}
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={styles.notificationContent}>
                <div style={styles.notificationMessage}>
                  <strong>{notification.channel}</strong> {notification.message}
                </div>
                {notification.action && (
                  <div style={styles.notificationAction}>
                    {notification.action}
                  </div>
                )}
                <div style={styles.notificationTime}>
                  {notification.time}
                </div>
              </div>

              {/* Thumbnail if exists */}
              {notification.videoThumb && (
                <div style={styles.notificationThumb}>
                  <img 
                    src={notification.videoThumb} 
                    alt=""
                    style={styles.thumbImg}
                  />
                </div>
              )}

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeNotification(notification.id)
                }}
                style={styles.removeButton}
                title="Remove"
              >
                ✕
              </button>

              {/* Unread dot */}
              {!notification.read && <div style={styles.unreadDot} />}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div style={styles.footer}>
          <Link to="/notifications" style={styles.viewAllLink} onClick={onClose}>
            View all notifications
          </Link>
        </div>
      )}
    </div>
  )
}

const styles = {
  dropdown: {
    position: 'absolute',
    top: '45px',
    right: '0',
    width: '380px',
    maxHeight: '480px',
    backgroundColor: '#282828',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    border: '1px solid #3f3f3f',
    zIndex: 1100,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #3f3f3f',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: 'white',
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  headerButton: {
    padding: '4px 8px',
    backgroundColor: '#3f3f3f',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  closeButton: {
    width: '24px',
    height: '24px',
    backgroundColor: 'transparent',
    color: '#aaa',
    border: 'none',
    borderRadius: '50%',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  notificationList: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '380px',
  },
  notificationItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #3f3f3f',
    position: 'relative',
    transition: 'background-color 0.2s',
  },
  notificationIcon: {
    flexShrink: 0,
    width: '40px',
    height: '40px',
  },
  channelAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3ea6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
  },
  iconEmoji: {
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  notificationMessage: {
    fontSize: '13px',
    color: 'white',
    marginBottom: '4px',
    lineHeight: '1.4',
  },
  notificationAction: {
    fontSize: '12px',
    color: '#aaa',
    marginBottom: '4px',
  },
  notificationTime: {
    fontSize: '11px',
    color: '#666',
  },
  notificationThumb: {
    width: '40px',
    height: '40px',
    borderRadius: '4px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '20px',
    height: '20px',
    backgroundColor: '#3f3f3f',
    color: '#aaa',
    border: 'none',
    borderRadius: '50%',
    fontSize: '10px',
    cursor: 'pointer',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  unreadDot: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#3ea6ff',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '14px',
    color: 'white',
    marginBottom: '4px',
  },
  emptySubtext: {
    fontSize: '12px',
    color: '#666',
  },
  footer: {
    padding: '12px 16px',
    borderTop: '1px solid #3f3f3f',
    textAlign: 'center',
  },
  viewAllLink: {
    color: '#3ea6ff',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
  },
}

// Add hover styles
const style = document.createElement('style')
style.textContent = `
  .notification-item:hover {
    background-color: #3f3f3f !important;
  }
  .notification-item:hover .remove-button {
    display: flex !important;
  }
  .remove-button:hover {
    background-color: #ff4444 !important;
    color: white !important;
  }
  .header-button:hover {
    background-color: #4f4f4f !important;
  }
  .close-button:hover {
    background-color: #3f3f3f !important;
    color: white !important;
  }
  .view-all-link:hover {
    text-decoration: underline !important;
  }
`
document.head.appendChild(style)