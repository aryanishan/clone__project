import React from 'react'
import Navbar from './navbar'
import Sidebar from './sidebar'

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <header style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #333' }}>
        <Navbar />
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '1rem' }}>{children}</main>
      </div>
    </div>
  )
}
