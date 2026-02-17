// components/CategoryFilters.jsx
import React, { useRef } from 'react'

export default function CategoryFilters({ categories, selectedCategory, onSelectCategory }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="yt-category-filters">
      <button 
        className="yt-scroll-button yt-scroll-left"
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>

      <div className="yt-categories" ref={scrollRef}>
        {categories.map((category) => (
          <button
            key={category}
            className={`yt-category-chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <button 
        className="yt-scroll-button yt-scroll-right"
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>

      <style jsx>{`
        .yt-category-filters {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: var(--space-xl);
          padding: 0 var(--space-xl);
        }
        
        .yt-categories {
          display: flex;
          gap: var(--space-md);
          overflow-x: auto;
          scrollbar-width: none;
          padding: var(--space-sm) 0;
          flex: 1;
        }
        
        .yt-categories::-webkit-scrollbar {
          display: none;
        }
        
        .yt-category-chip {
          padding: var(--space-sm) var(--space-md);
          background-color: var(--yt-black-lighter);
          border: none;
          border-radius: var(--radius-full);
          color: var(--yt-white);
          font-size: var(--font-sm);
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .yt-category-chip:hover {
          background-color: var(--yt-gray);
        }
        
        .yt-category-chip.active {
          background-color: var(--yt-white);
          color: var(--yt-black);
        }
        
        .yt-scroll-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background-color: var(--yt-black);
          border: 1px solid var(--yt-gray);
          color: var(--yt-white);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          opacity: 0;
          transition: opacity var(--transition-fast);
        }
        
        .yt-category-filters:hover .yt-scroll-button {
          opacity: 1;
        }
        
        .yt-scroll-left {
          left: 0;
        }
        
        .yt-scroll-right {
          right: 0;
        }
        
        .yt-scroll-button:hover {
          background-color: var(--yt-gray);
        }
        
        @media (max-width: 768px) {
          .yt-category-filters {
            padding: 0 var(--space-md);
          }
          
          .yt-scroll-button {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}