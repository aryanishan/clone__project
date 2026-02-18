// components/navbar.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NotificationDropdown from './NotificationDropdown'
import { useNotifications } from '../context/NotificationContext'

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()
  const { unreadCount, setShowDropdown } = useNotifications()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    setShowDropdown(!showNotifications)
  }

  return (
    <nav style={styles.navbar}>
      {/* Left section */}
      <div style={styles.leftSection}>
        <button style={styles.iconButton}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        
        <Link to="/" style={styles.logo}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#ff0000">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
          <span style={styles.logoText}>MediaStreamer</span>
        </Link>
      </div>

      {/* Search section */}
      <div style={styles.searchSection}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </form>
      </div>

      {/* Right section */}
      <div style={styles.rightSection}>
        <button style={styles.iconButton}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
        </button>
        
        {/* Notification Button with Badge */}
        <div style={styles.notificationContainer}>
          <button 
            onClick={toggleNotifications}
            style={styles.iconButton}
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            {unreadCount > 0 && (
              <span style={styles.notificationBadge}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        <Link to="/profile" style={styles.avatar}>
          <div style={styles.avatarInner}>U</div>
        </Link>
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: '56px',
    backgroundColor: '#0f0f0f',
    borderBottom: '1px solid #303030',
    position: 'relative',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'white',
    gap: '4px',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '500',
  },
  searchSection: {
    flex: 1,
    maxWidth: '600px',
    margin: '0 20px',
  },
  searchForm: {
    display: 'flex',
    width: '100%',
  },
  searchInput: {
    flex: 1,
    height: '36px',
    padding: '0 12px',
    backgroundColor: '#121212',
    border: '1px solid #303030',
    borderRadius: '20px 0 0 20px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
  },
  searchButton: {
    width: '60px',
    height: '36px',
    backgroundColor: '#222',
    border: '1px solid #303030',
    borderLeft: 'none',
    borderRadius: '0 20px 20px 0',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
  },
  iconButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    backgroundColor: '#ff0000',
    color: 'white',
    fontSize: '10px',
    fontWeight: '600',
    minWidth: '16px',
    height: '16px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  },
  avatar: {
    textDecoration: 'none',
  },
  avatarInner: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3ea6ff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '500',
  },
}

// Add hover effects
const style = document.createElement('style')
style.textContent = `
  .icon-button:hover {
    background-color: #272727 !important;
  }
  .search-button:hover {
    background-color: #3f3f3f !important;
  }
`
document.head.appendChild(style)