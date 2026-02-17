// pages/Watch.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getVideo, searchVideos, getChannelVideos } from '../lib/api'
import VideoCard from '../components/VideoCard'

export default function Watch() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [related, setRelated] = useState([])
  const [channelVideos, setChannelVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    let mounted = true
    
    const loadVideo = async () => {
      setLoading(true)
      try {
        const videoData = await getVideo(id)
        if (!mounted || !videoData) return
        
        setVideo(videoData)
        
        // Load related videos
        const relatedData = await searchVideos(videoData.title.split(' ').slice(0, 3).join(' '), 12)
        if (mounted) {
          setRelated(relatedData.filter(v => v.id !== id))
        }
        
        // Load more from same channel
        if (videoData.channelId) {
          const channelData = await getChannelVideos(videoData.channelId, 6)
          if (mounted) {
            setChannelVideos(channelData.filter(v => v.id !== id))
          }
        }
      } catch (error) {
        console.error('Failed to load video:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadVideo()

    return () => {
      mounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="yt-loading">
        <div className="yt-spinner"></div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="yt-error">
        <h2>Video not found</h2>
        <p>The video you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="yt-back-button">Go back home</Link>
      </div>
    )
  }

  return (
    <div className="yt-watch">
      <div className="yt-watch-container">
        {/* Main Video Section */}
        <div className="yt-video-section">
          <div className="yt-video-player">
            <iframe
              src={`https://www.youtube.com/embed/${id}?autoplay=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="yt-video-info-section">
            <h1 className="yt-video-title">{video.title}</h1>
            
            <div className="yt-video-actions">
              <div className="yt-channel-info">
                <div className="yt-channel-avatar">
                  <div className="yt-avatar-placeholder">
                    {video.channel.charAt(0)}
                  </div>
                </div>
                <div className="yt-channel-details">
                  <h3 className="yt-channel-name">{video.channel}</h3>
                  <p className="yt-channel-stats">1.2M subscribers</p>
                </div>
                <button className="yt-subscribe-btn">Subscribe</button>
              </div>

              <div className="yt-video-stats">
                <div className="yt-stats-group">
                  <button className="yt-stat-btn like">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                    </svg>
                    <span>{video.likes || '12K'}</span>
                  </button>
                  <button className="yt-stat-btn dislike">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                    </svg>
                  </button>
                </div>
                <button className="yt-share-btn">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                  </svg>
                  <span>Share</span>
                </button>
                <button className="yt-save-btn">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                  </svg>
                  <span>Save</span>
                </button>
              </div>
            </div>

            <div className="yt-video-description">
              <div className="yt-description-stats">
                <span>{video.views}</span>
                <span>•</span>
                <span>{video.time}</span>
              </div>
              <div className={`yt-description-text ${showMore ? 'expanded' : ''}`}>
                {video.description}
              </div>
              {video.description?.length > 200 && (
                <button 
                  className="yt-show-more"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related Videos Section */}
        <div className="yt-related-section">
          <h3 className="yt-section-title">Related</h3>
          <div className="yt-related-videos">
            {related.slice(0, 8).map((video) => (
              <Link key={video.id} to={`/watch/${video.id}`} className="yt-related-item">
                <div className="yt-related-thumbnail">
                  <img src={video.thumbnail} alt={video.title} loading="lazy" />
                  <span className="yt-duration">10:30</span>
                </div>
                <div className="yt-related-info">
                  <h4 className="yt-related-title">{video.title}</h4>
                  <p className="yt-related-channel">{video.channel}</p>
                  <p className="yt-related-meta">{video.views} • {video.time}</p>
                </div>
              </Link>
            ))}
          </div>

          {channelVideos.length > 0 && (
            <>
              <h3 className="yt-section-title">More from {video.channel}</h3>
              <div className="yt-channel-videos">
                {channelVideos.map((video) => (
                  <Link key={video.id} to={`/watch/${video.id}`} className="yt-channel-item">
                    <div className="yt-channel-thumbnail">
                      <img src={video.thumbnail} alt={video.title} loading="lazy" />
                    </div>
                    <div className="yt-channel-info">
                      <h4 className="yt-channel-video-title">{video.title}</h4>
                      <p className="yt-channel-video-meta">{video.time}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .yt-watch {
          min-height: 100vh;
        }
        
        .yt-watch-container {
          display: flex;
          gap: var(--space-xl);
          max-width: 1800px;
          margin: 0 auto;
        }
        
        .yt-video-section {
          flex: 1;
          min-width: 0;
        }
        
        .yt-video-player {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background-color: black;
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: var(--space-lg);
        }
        
        .yt-video-player iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .yt-video-info-section {
          padding: 0 var(--space-md);
        }
        
        .yt-video-title {
          font-size: var(--font-xl);
          font-weight: 600;
          color: var(--yt-white);
          margin-bottom: var(--space-md);
          line-height: 1.4;
        }
        
        .yt-video-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
          gap: var(--space-md);
        }
        
        .yt-channel-info {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        
        .yt-channel-avatar {
          width: 48px;
          height: 48px;
        }
        
        .yt-avatar-placeholder {
          width: 100%;
          height: 100%;
          border-radius: var(--radius-full);
          background-color: var(--yt-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-xl);
          font-weight: 600;
          color: var(--yt-white);
        }
        
        .yt-channel-details {
          margin-right: var(--space-md);
        }
        
        .yt-channel-name {
          font-size: var(--font-md);
          font-weight: 500;
          color: var(--yt-white);
          margin-bottom: 2px;
        }
        
        .yt-channel-stats {
          font-size: var(--font-xs);
          color: var(--yt-white-darker);
        }
        
        .yt-subscribe-btn {
          padding: var(--space-sm) var(--space-lg);
          background-color: var(--yt-red);
          color: var(--yt-white);
          border: none;
          border-radius: var(--radius-full);
          font-size: var(--font-sm);
          font-weight: 500;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        
        .yt-subscribe-btn:hover {
          background-color: var(--yt-red-dark);
        }
        
        .yt-video-stats {
          display: flex;
          gap: var(--space-sm);
        }
        
        .yt-stats-group {
          display: flex;
          background-color: var(--yt-black-lighter);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        
        .yt-stat-btn {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-sm) var(--space-md);
          background: none;
          border: none;
          color: var(--yt-white);
          font-size: var(--font-sm);
          font-weight: 500;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        
        .yt-stat-btn:hover {
          background-color: var(--yt-gray);
        }
        
        .yt-stat-btn.like {
          border-right: 1px solid var(--yt-gray);
        }
        
        .yt-share-btn,
        .yt-save-btn {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-sm) var(--space-md);
          background-color: var(--yt-black-lighter);
          border: none;
          border-radius: var(--radius-full);
          color: var(--yt-white);
          font-size: var(--font-sm);
          font-weight: 500;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        
        .yt-share-btn:hover,
        .yt-save-btn:hover {
          background-color: var(--yt-gray);
        }
        
        .yt-video-description {
          padding: var(--space-md);
          background-color: var(--yt-black-lighter);
          border-radius: var(--radius-lg);
        }
        
        .yt-description-stats {
          display: flex;
          gap: var(--space-xs);
          color: var(--yt-white-darker);
          font-size: var(--font-sm);
          margin-bottom: var(--space-sm);
        }
        
        .yt-description-text {
          color: var(--yt-white);
          font-size: var(--font-sm);
          line-height: 1.6;
          white-space: pre-wrap;
          max-height: 100px;
          overflow: hidden;
          transition: max-height var(--transition-base);
        }
        
        .yt-description-text.expanded {
          max-height: 1000px;
        }
        
        .yt-show-more {
          margin-top: var(--space-sm);
          background: none;
          border: none;
          color: var(--yt-white-darker);
          font-size: var(--font-sm);
          font-weight: 500;
          cursor: pointer;
        }
        
        .yt-show-more:hover {
          color: var(--yt-white);
        }
        
        .yt-related-section {
          width: 400px;
          flex-shrink: 0;
        }
        
        .yt-section-title {
          font-size: var(--font-lg);
          font-weight: 500;
          color: var(--yt-white);
          margin-bottom: var(--space-lg);
        }
        
        .yt-related-videos {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          margin-bottom: var(--space-2xl);
        }
        
        .yt-related-item {
          display: flex;
          gap: var(--space-sm);
          text-decoration: none;
          color: inherit;
        }
        
        .yt-related-thumbnail {
          position: relative;
          width: 168px;
          aspect-ratio: 16 / 9;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .yt-related-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .yt-related-info {
          flex: 1;
          min-width: 0;
        }
        
        .yt-related-title {
          font-size: var(--font-sm);
          font-weight: 500;
          color: var(--yt-white);
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .yt-related-channel,
        .yt-related-meta {
          font-size: var(--font-xs);
          color: var(--yt-white-darker);
          margin-bottom: 2px;
        }
        
        .yt-channel-videos {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        
        .yt-channel-item {
          display: flex;
          gap: var(--space-sm);
          text-decoration: none;
          color: inherit;
        }
        
        .yt-channel-thumbnail {
          width: 120px;
          aspect-ratio: 16 / 9;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .yt-channel-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .yt-channel-video-title {
          font-size: var(--font-sm);
          font-weight: 500;
          color: var(--yt-white);
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .yt-channel-video-meta {
          font-size: var(--font-xs);
          color: var(--yt-white-darker);
        }
        
        .yt-loading,
        .yt-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }
        
        .yt-error h2 {
          font-size: var(--font-2xl);
          color: var(--yt-white);
          margin-bottom: var(--space-md);
        }
        
        .yt-error p {
          color: var(--yt-white-darker);
          margin-bottom: var(--space-xl);
        }
        
        .yt-back-button {
          padding: var(--space-sm) var(--space-xl);
          background-color: var(--yt-red);
          color: var(--yt-white);
          text-decoration: none;
          border-radius: var(--radius-full);
          font-weight: 500;
        }
        
        .yt-back-button:hover {
          background-color: var(--yt-red-dark);
        }
        
        @media (max-width: 1200px) {
          .yt-watch-container {
            flex-direction: column;
          }
          
          .yt-related-section {
            width: 100%;
          }
        }
        
        @media (max-width: 768px) {
          .yt-video-actions {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .yt-channel-info {
            width: 100%;
          }
          
          .yt-video-stats {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  )
}