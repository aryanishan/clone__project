// components/sidebar.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  
  const menuItems = [
  { icon: '🏠', label: 'Home', path: '/' },
  { icon: '▶️', label: 'Shorts', path: '/shorts' },
  { icon: '📺', label: 'Subscriptions', path: '/subscriptions' },
  { icon: '📚', label: 'Library', path: '/library' },
  { icon: '📜', label: 'History', path: '/history' },
  { icon: '🔍', label: 'Search History', path: '/search-history' }, // Added
]

  return (
    <aside style={styles.sidebar}>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.menuItem,
              backgroundColor: isActive ? '#272727' : 'transparent',
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span style={styles.label}>{item.label}</span>
          </Link>
        )
      })}
    </aside>
  )
}

const styles = {
  sidebar: {
    width: '200px',
    backgroundColor: '#0f0f0f',
    height: 'calc(100vh - 56px)',
    position: 'sticky',
    top: '56px',
    padding: '12px 0',
    borderRight: '1px solid #303030',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    textDecoration: 'none',
    color: 'white',
    gap: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  icon: {
    fontSize: '20px',
    width: '24px',
    textAlign: 'center',
  },
  label: {
    fontSize: '14px',
  },
}