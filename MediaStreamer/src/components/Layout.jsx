// components/Layout.jsx
import React from 'react'
import Navbar from './navbar'
import Sidebar from './sidebar'

export default function Layout({ children }) {
  const headerHeight = 56

  return (
    <div className="yt-layout">
      <header 
        className="yt-header"
        style={{ height: headerHeight }}
      >
        <Navbar />
      </header>

      <div 
        className="yt-main-container"
        style={{ marginTop: headerHeight }}
      >
        <Sidebar />
        <main className="yt-content">
          {children}
        </main>
      </div>

      <style jsx>{`
        .yt-layout {
          display: flex;
          min-height: 100vh;
          flex-direction: column;
        }
        
        .yt-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: var(--yt-black);
          border-bottom: 1px solid var(--yt-gray);
          z-index: 1000;
        }
        
        .yt-main-container {
          display: flex;
          flex: 1;
        }
        
        .yt-content {
          flex: 1;
          padding: var(--space-xl);
          max-width: calc(100% - 240px);
          margin-left: 240px;
        }
        
        @media (max-width: 768px) {
          .yt-content {
            padding: var(--space-lg);
            max-width: 100%;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  )
}