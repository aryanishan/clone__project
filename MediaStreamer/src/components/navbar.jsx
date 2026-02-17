// components/navbar.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav className="yt-navbar">
      {/* Left Section - Menu + Logo */}
      <div className="yt-nav-left">
        <button className="yt-icon-button yt-menu-button" aria-label="Menu">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        
        <Link to="/" className="yt-logo">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="var(--yt-red)">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
          <span className="yt-logo-text">YouTube</span>
        </Link>
      </div>

      {/* Middle Section - Search */}
      <div className="yt-nav-center">
        <form onSubmit={handleSearch} className="yt-search-form">
          <div className={`yt-search-container ${isSearchFocused ? 'focused' : ''}`}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="yt-search-input"
            />
            <button type="submit" className="yt-search-button" aria-label="Search">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
        </form>
        
        <button className="yt-icon-button yt-voice-button" aria-label="Voice search">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
          </svg>
        </button>
      </div>

      {/* Right Section - Actions */}
      <div className="yt-nav-right">
        <button className="yt-icon-button" aria-label="Create">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
          </svg>
        </button>
        
        <button className="yt-icon-button" aria-label="Notifications">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </button>
        
        <Link to="/profile" className="yt-avatar">
          <div className="yt-avatar-inner">U</div>
        </Link>
      </div>

      <style jsx>{`
        .yt-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-lg);
          height: 56px;
          background-color: var(--yt-black);
        }
        
        .yt-nav-left {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        
        .yt-icon-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: transparent;
          border: none;
          color: var(--yt-white-dark);
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        
        .yt-icon-button:hover {
          background-color: var(--yt-black-lighter);
        }
        
        .yt-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          gap: var(--space-xs);
          margin-left: var(--space-xs);
        }
        
        .yt-logo-text {
          font-size: var(--font-xl);
          font-weight: 600;
          color: var(--yt-white-dark);
          letter-spacing: -0.5px;
        }
        
        .yt-nav-center {
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 700px;
          margin: 0 var(--space-xl);
        }
        
        .yt-search-form {
          display: flex;
          flex: 1;
        }
        
        .yt-search-container {
          display: flex;
          flex: 1;
          align-items: stretch;
          border: 1px solid var(--yt-gray);
          border-radius: var(--radius-full);
          overflow: hidden;
          transition: border-color var(--transition-fast);
        }
        
        .yt-search-container.focused {
          border-color: var(--yt-blue);
        }
        
        .yt-search-input {
          flex: 1;
          padding: 0 var(--space-lg);
          font-size: var(--font-md);
          background-color: var(--yt-black-light);
          border: none;
          color: var(--yt-white-dark);
          outline: none;
          height: 40px;
        }
        
        .yt-search-input::placeholder {
          color: var(--yt-white-darker);
        }
        
        .yt-search-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 40px;
          background-color: var(--yt-black-lighter);
          border: none;
          border-left: 1px solid var(--yt-gray);
          color: var(--yt-white-dark);
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        
        .yt-search-button:hover {
          background-color: var(--yt-gray);
        }
        
        .yt-voice-button {
          margin-left: var(--space-sm);
          background-color: var(--yt-black-light);
        }
        
        .yt-nav-right {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        
        .yt-avatar {
          text-decoration: none;
        }
        
        .yt-avatar-inner {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background-color: var(--yt-blue);
          color: var(--yt-white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-sm);
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .yt-nav-center {
            margin: 0 var(--space-md);
          }
          
          .yt-voice-button {
            display: none;
          }
          
          .yt-logo-text {
            display: none;
          }
        }
      `}</style>
    </nav>
  )
}