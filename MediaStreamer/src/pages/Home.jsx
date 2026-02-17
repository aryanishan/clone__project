// pages/Home.jsx
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchTrending, searchVideos } from '../lib/api'
import VideoCard from '../components/VideoCard'
import CategoryFilters from '../components/CategoryFilters'

const categories = [
  'All', 'Music', 'Gaming', 'News', 'Sports', 'Learning', 
  'Movies', 'TV', 'Fashion', 'Beauty', 'Tech', 'Travel'
]

export default function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('search')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    let mounted = true
    
    const loadVideos = async () => {
      setLoading(true)
      try {
        let results
        if (query) {
          results = await searchVideos(query)
        } else {
          results = await fetchTrending()
        }
        if (mounted) {
          setVideos(results)
        }
      } catch (error) {
        console.error('Failed to load videos:', error)
        if (mounted) {
          setVideos([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadVideos()

    return () => {
      mounted = false
    }
  }, [query])

  return (
    <div className="yt-home">
      <CategoryFilters 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <main className="yt-home-content">
        {loading ? (
          <div className="yt-loading">
            <div className="yt-spinner"></div>
          </div>
        ) : (
          <>
            {query && (
              <div className="yt-search-header">
                Search results for "{query}"
              </div>
            )}
            
            <div className="yt-video-grid">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
            
            {videos.length === 0 && (
              <div className="yt-no-results">
                <h3>No videos found</h3>
                <p>Try different keywords or check back later</p>
              </div>
            )}
          </>
        )}
      </main>

      <style jsx>{`
        .yt-home {
          min-height: 100vh;
        }
        
        .yt-home-content {
          max-width: 2000px;
          margin: 0 auto;
        }
        
        .yt-search-header {
          margin-bottom: var(--space-lg);
          color: var(--yt-white-darker);
          font-size: var(--font-md);
        }
        
        .yt-video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-xl) var(--space-lg);
        }
        
        .yt-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }
        
        .yt-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--yt-gray);
          border-top-color: var(--yt-red);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .yt-no-results {
          text-align: center;
          padding: var(--space-2xl);
          color: var(--yt-white-darker);
        }
        
        .yt-no-results h3 {
          font-size: var(--font-xl);
          margin-bottom: var(--space-sm);
          color: var(--yt-white);
        }
        
        @media (max-width: 768px) {
          .yt-video-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: var(--space-lg);
          }
        }
      `}</style>
    </div>
  )
}