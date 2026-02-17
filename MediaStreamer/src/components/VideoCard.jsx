// components/VideoCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video.id}`} className="yt-video-card">
      <div className="yt-thumbnail">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="yt-thumbnail-image"
          loading="lazy"
        />
        <span className="yt-duration">10:30</span>
      </div>
      
      <div className="yt-video-info">
        <div className="yt-channel-avatar">
          <div className="yt-avatar-placeholder">
            {video.channel.charAt(0)}
          </div>
        </div>
        
        <div className="yt-video-details">
          <h3 className="yt-video-title">{video.title}</h3>
          <p className="yt-channel-name">{video.channel}</p>
          <p className="yt-video-meta">
            {video.views} • {video.time}
          </p>
        </div>
      </div>

      <style jsx>{`
        .yt-video-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          transition: transform var(--transition-fast);
        }
        
        .yt-video-card:hover {
          transform: translateY(-2px);
        }
        
        .yt-thumbnail {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background-color: var(--yt-black-lighter);
          margin-bottom: var(--space-md);
        }
        
        .yt-thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-base);
        }
        
        .yt-video-card:hover .yt-thumbnail-image {
          transform: scale(1.05);
        }
        
        .yt-duration {
          position: absolute;
          bottom: var(--space-xs);
          right: var(--space-xs);
          background-color: rgba(0, 0, 0, 0.8);
          color: var(--yt-white);
          padding: 2px var(--space-xs);
          border-radius: var(--radius-sm);
          font-size: var(--font-xs);
          font-weight: 500;
        }
        
        .yt-video-info {
          display: flex;
          gap: var(--space-md);
        }
        
        .yt-channel-avatar {
          flex-shrink: 0;
        }
        
        .yt-avatar-placeholder {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background-color: var(--yt-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-md);
          font-weight: 600;
          color: var(--yt-white);
        }
        
        .yt-video-details {
          flex: 1;
          min-width: 0;
        }
        
        .yt-video-title {
          font-size: var(--font-md);
          font-weight: 500;
          color: var(--yt-white);
          margin-bottom: var(--space-xs);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }
        
        .yt-channel-name {
          font-size: var(--font-sm);
          color: var(--yt-white-darker);
          margin-bottom: 2px;
        }
        
        .yt-video-meta {
          font-size: var(--font-sm);
          color: var(--yt-white-darker);
        }
        
        .yt-channel-name:hover {
          color: var(--yt-white);
        }
      `}</style>
    </Link>
  )
}