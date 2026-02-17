// pages/Home.jsx
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchTrending, searchVideos } from '../lib/api'
import VideoCard from '../components/VideoCard'

export default function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('search')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    const loadVideos = async () => {
      setLoading(true)
      try {
        const results = query 
          ? await searchVideos(query)
          : await fetchTrending()
        if (mounted) setVideos(results)
      } catch (error) {
        console.error('Failed to load videos:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadVideos()
    return () => { mounted = false }
  }, [query])

  return (
    <div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
          Loading...
        </div>
      ) : (
        <>
          {query && (
            <p style={{ marginBottom: '16px', color: '#aaa' }}>
              Search results for "{query}"
            </p>
          )}
          <div style={styles.grid}>
            {videos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          {videos.length === 0 && (
            <p style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
              No videos found
            </p>
          )}
        </>
      )}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px 16px',
  },
}