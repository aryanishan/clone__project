import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`)
    } else {
      navigate('/')
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.start}>
        <button className={styles.menuBtn} title="Menu">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style={{ width: 24, height: 24, fill: 'currentColor' }}><g><path d="M21,6H3V5h18V6z M21,11H3v1h18V11z M21,17H3v1h18V17z"></path></g></svg>
        </button>
        <Link to="/" className={styles.logo}>
          <span style={{ color: 'var(--yt-primary)', fontSize: '1.6rem', lineHeight: 1 }}>▶</span> MediaStreamer
        </Link>
      </div>

      <div className={styles.center}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn} title="Search">🔍</button>
        </form>
      </div>

      <div className={styles.end}>
        <button className={styles.iconBtn} title="Create">➕</button>
        <button className={styles.iconBtn} title="Notifications">🔔</button>
        <button onClick={toggleTheme} className={styles.iconBtn} title="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className={styles.avatar}>U</div>
      </div>
    </header>
  )
}