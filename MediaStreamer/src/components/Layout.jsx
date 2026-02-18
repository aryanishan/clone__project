// components/Layout.jsx
import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './sidebar'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(true)
      else setSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div style={styles.layout}>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div style={styles.body}>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={styles.overlay} />
        )}

        <main
          style={{
            ...styles.main,
            marginLeft: sidebarOpen && !isMobile ? '240px' : '0',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

const styles = {
  layout: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    color: '#fff',
    fontFamily: "'Roboto', Arial, sans-serif",
  },
  body: {
    display: 'flex',
    marginTop: 56,
    position: 'relative',
  },
  main: {
    flex: 1,
    padding: '24px',
    transition: 'margin-left 0.22s ease',
    minHeight: 'calc(100vh - 56px)',
    width: '100%',
    overflowX: 'hidden',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    marginTop: 56,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 1400,
  },
}