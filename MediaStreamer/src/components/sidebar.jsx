// components/sidebar.jsx
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const location = useLocation()

  const menuItems = [
    { icon: 'home', label: 'Home', path: '/' },
    { icon: 'shorts', label: 'Shorts', path: '/shorts' },
    { icon: 'subscriptions', label: 'Subscriptions', path: '/subscriptions' },
  ]

  const libraryItems = [
    { icon: 'library', label: 'Library', path: '/library' },
    { icon: 'history', label: 'History', path: '/history' },
    { icon: 'yourVideos', label: 'Your videos', path: '/my-videos' },
    { icon: 'watchLater', label: 'Watch later', path: '/watch-later' },
    { icon: 'liked', label: 'Liked videos', path: '/liked' },
  ]

  const subscriptions = [
    { name: 'Channel 1', avatar: 'C1' },
    { name: 'Channel 2', avatar: 'C2' },
    { name: 'Channel 3', avatar: 'C3' },
  ]

  const renderIcon = (iconName, isActive) => {
    const color = isActive ? 'var(--yt-white)' : 'currentColor'
    const size = 24

    switch(iconName) {
      case 'home':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        )
      case 'shorts':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
        )
      case 'subscriptions':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/>
          </svg>
        )
      case 'library':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/>
          </svg>
        )
      case 'history':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
          </svg>
        )
      case 'yourVideos':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
        )
      case 'watchLater':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
          </svg>
        )
      case 'liked':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <aside 
      className={`yt-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="yt-sidebar-content">
        {/* Main Menu */}
        <div className="yt-sidebar-section">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`yt-sidebar-item ${isActive ? 'active' : ''}`}
              >
                <div className="yt-sidebar-icon">
                  {renderIcon(item.icon, isActive)}
                </div>
                {(isExpanded) && (
                  <span className="yt-sidebar-label">{item.label}</span>
                )}
              </Link>
            )
          })}
        </div>

        <div className="yt-sidebar-divider" />

        {/* Library */}
        <div className="yt-sidebar-section">
          {libraryItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`yt-sidebar-item ${isActive ? 'active' : ''}`}
              >
                <div className="yt-sidebar-icon">
                  {renderIcon(item.icon, isActive)}
                </div>
                {(isExpanded) && (
                  <span className="yt-sidebar-label">{item.label}</span>
                )}
              </Link>
            )
          })}
        </div>

        {isExpanded && (
          <>
            <div className="yt-sidebar-divider" />
            
            {/* Subscriptions */}
            <div className="yt-sidebar-section">
              <div className="yt-sidebar-header">Subscriptions</div>
              {subscriptions.map((sub, index) => (
                <div key={index} className="yt-sidebar-item">
                  <div className="yt-sidebar-avatar">{sub.avatar}</div>
                  <span className="yt-sidebar-label">{sub.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .yt-sidebar {
          position: fixed;
          left: 0;
          top: 56px;
          height: calc(100vh - 56px);
          background-color: var(--yt-black);
          transition: width var(--transition-base);
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 900;
        }
        
        .yt-sidebar.collapsed {
          width: 72px;
        }
        
        .yt-sidebar.expanded {
          width: 240px;
          box-shadow: var(--shadow-lg);
        }
        
        .yt-sidebar-content {
          padding: var(--space-md) 0;
        }
        
        .yt-sidebar-section {
          padding: 0 var(--space-md);
        }
        
        .yt-sidebar-item {
          display: flex;
          align-items: center;
          padding: 0 var(--space-md);
          height: 40px;
          border-radius: var(--radius-md);
          text-decoration: none;
          color: var(--yt-white-dark);
          margin-bottom: var(--space-xs);
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        
        .yt-sidebar-item:hover {
          background-color: var(--yt-black-lighter);
        }
        
        .yt-sidebar-item.active {
          background-color: var(--yt-black-lighter);
          color: var(--yt-white);
          font-weight: 500;
        }
        
        .yt-sidebar-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          margin-right: var(--space-xl);
          color: inherit;
        }
        
        .yt-sidebar-label {
          font-size: var(--font-sm);
          white-space: nowrap;
          color: inherit;
        }
        
        .yt-sidebar-divider {
          height: 1px;
          background-color: var(--yt-gray);
          margin: var(--space-md) 0;
        }
        
        .yt-sidebar-header {
          font-size: var(--font-md);
          font-weight: 500;
          color: var(--yt-white);
          padding: var(--space-sm) var(--space-md);
          margin-bottom: var(--space-sm);
        }
        
        .yt-sidebar-avatar {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          background-color: var(--yt-gray);
          color: var(--yt-white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-xs);
          font-weight: 600;
          margin-right: var(--space-xl);
        }
        
        /* Scrollbar styling for sidebar */
        .yt-sidebar::-webkit-scrollbar {
          width: 4px;
        }
        
        .yt-sidebar::-webkit-scrollbar-thumb {
          background: var(--yt-gray);
          border-radius: var(--radius-full);
        }
        
        .yt-sidebar::-webkit-scrollbar-thumb:hover {
          background: var(--yt-gray-light);
        }
      `}</style>
    </aside>
  )
}