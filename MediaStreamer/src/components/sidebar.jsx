// components/sidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'

const menuItems = [
  { path: '/',               exact: true,  label: 'Home',          Icon: HomeIcon   },
  { path: '/shorts',         exact: false, label: 'Shorts',        Icon: ShortsIcon },
  { path: '/subscriptions',  exact: false, label: 'Subscriptions', Icon: SubsIcon   },
  { path: '/library',        exact: false, label: 'Library',       Icon: LibIcon    },
  { path: '/history',        exact: false, label: 'History',       Icon: HistIcon   },
  { path: '/search-history', exact: false, label: 'Search History',Icon: SearchIcon },
]

export default function Sidebar({ open }) {
  return (
    <aside style={{ ...styles.sidebar, transform: open ? 'translateX(0)' : 'translateX(-100%)' }}>
      <nav style={styles.menu}>
        {menuItems.map(({ path, exact, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            style={({ isActive }) => ({
              ...styles.item,
              backgroundColor: isActive ? '#1f1f1f' : 'transparent',
              color:            isActive ? '#fff'    : '#ccc',
              fontWeight:       isActive ? 700       : 400,
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ ...styles.iconWrap, color: isActive ? '#fff' : '#888' }}>
                  <Icon />
                </span>
                <span style={styles.label}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={styles.divider} />

      <div style={styles.footer}>
        {['About', 'Press', 'Copyright', 'Contact', 'Creators', 'Advertise', 'Developers'].map(t => (
          <span key={t} style={styles.footerLink}>{t}</span>
        ))}
        <p style={styles.copy}>© 2026 Streamr LLC</p>
      </div>
    </aside>
  )
}

// ── Icons ──────────────────────────────────────────────────────────────────────
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  )
}
function ShortsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.23-2.53-5.06-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25l1.2.5L6 14.94c-1.84.96-2.53 3.23-1.56 5.06.97 1.83 3.23 2.53 5.06 1.56l8.5-4.5c1.29-.68 2.07-2.04 2-3.49-.07-1.42-.93-2.67-2.23-3.25zM10 14.65V9.35l4.56 2.65-4.56 2.65z" />
    </svg>
  )
}
function SubsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 012-2h16a2 2 0 012 2zm-6 4l-6-3.27v6.53L16 16z" />
    </svg>
  )
}
function LibIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
    </svg>
  )
}
function HistIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  )
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = {
  sidebar: {
    position: 'fixed',
    top: 56,
    left: 0,
    width: 240,
    height: 'calc(100vh - 56px)',
    backgroundColor: '#0f0f0f',
    borderRight: '1px solid #1a1a1a',
    overflowY: 'auto',
    padding: '8px 0',
    zIndex: 1500,
    transition: 'transform 0.22s ease',
    scrollbarWidth: 'none',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    padding: '10px 24px',
    textDecoration: 'none',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'background 0.15s',
    borderRadius: 0,
  },
  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  label: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    background: '#1a1a1a',
    margin: '12px 0',
  },
  footer: {
    padding: '4px 24px 20px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px 10px',
  },
  footerLink: {
    fontSize: 12,
    color: '#3a3a3a',
    cursor: 'pointer',
  },
  copy: {
    width: '100%',
    fontSize: 11,
    color: '#2e2e2e',
    marginTop: 10,
  },
}