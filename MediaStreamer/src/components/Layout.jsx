import React from 'react'
import Navbar from './navbar'
import Sidebar from './sidebar'

export default function Layout({ children }) {
  const headerHeight = 56

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: headerHeight,
          padding: '0.5rem 1rem',
          borderBottom: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(10,10,10,0.98)',
          zIndex: 1000,
        }}
      >
        <Navbar />
      </header>

      <div style={{ display: 'flex', flex: 1, marginTop: headerHeight }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '1rem' }}>{children}</main>
      </div>
    </div>
  )
}
