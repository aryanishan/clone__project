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
      <Link to="/" className={styles.logo}>
        <span style={{ color: 'var(--yt-primary)' }}>▶</span> MediaStreamer
      </Link>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>🔍</button>
      </form>
      <div className={styles.actions}>
        <button onClick={toggleTheme} className={styles.iconBtn} title="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className={styles.avatar}>U</div>
      </div>
    </header>
  )
}