import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <button style={styles.menuButton} aria-label="Menu">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        <Link to="/" style={styles.logoContainer}>
          <div style={styles.logo}>
            <svg viewBox="0 0 24 24" width="30" height="30" fill="red">
              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
            </svg>
          </div>
          <span style={styles.logoText}>YouTube</span>
        </Link>
      </div>

      <div style={styles.middleSection}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton} aria-label="Search">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
        </form>
        <button style={styles.voiceButton} aria-label="Voice search">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
          </svg>
        </button>
      </div>

      <div style={styles.rightSection}>
        <button style={styles.iconButton} aria-label="Create">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
          </svg>
        </button>
        <button style={styles.iconButton} aria-label="Notifications">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </button>
        <Link to="/profile" style={styles.avatarButton}>
          <div style={styles.avatar}>U</div>
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
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginRight: '8px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: '-1px',
    fontFamily: '"Roboto", "Arial", sans-serif',
  },
  middleSection: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
    maxWidth: '700px',
    margin: '0 40px',
  },
  searchForm: {
    display: 'flex',
    flex: '1',
  },
  searchContainer: {
    display: 'flex',
    flex: '1',
    alignItems: 'stretch',
  },
  searchInput: {
    width: '100%',
    padding: '0 16px',
    fontSize: '16px',
    backgroundColor: '#121212',
    border: '1px solid #303030',
    borderRight: 'none',
    borderRadius: '40px 0 0 40px',
    color: 'white',
    outline: 'none',
    height: '40px',
  },
  searchButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '40px',
    backgroundColor: '#222222',
    border: '1px solid #303030',
    borderRadius: '0 40px 40px 0',
    cursor: 'pointer',
    padding: '0',
  },
  voiceButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#121212',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '16px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  avatarButton: {
    textDecoration: 'none',
    cursor: 'pointer',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3ea6ff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
  },
}
