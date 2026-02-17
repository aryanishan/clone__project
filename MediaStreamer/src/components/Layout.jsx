// components/Layout.jsx
import React from 'react'
import Navbar from './navbar'
import Sidebar from './sidebar'

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}