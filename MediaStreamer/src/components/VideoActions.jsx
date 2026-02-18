// components/VideoActions.jsx
import React, { useState } from 'react'

export default function VideoActions({ video }) {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleLike = () => {
    if (disliked) setDisliked(false)
    setLiked(!liked)
  }

  const handleDislike = () => {
    if (liked) setLiked(false)
    setDisliked(!disliked)
  }

  const handleSubscribe = () => {
    setSubscribed(!subscribed)
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const title = video.title
    
    switch(platform) {
      case 'copy':
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`)
        break
    }
    setShowShareMenu(false)
  }

  return (
    <div style={styles.container}>
      {/* Channel Info */}
      <div style={styles.channelInfo}>
        <div style={styles.channelAvatar}>
          {video.channel?.charAt(0)}
        </div>
        <div style={styles.channelDetails}>
          <h3 style={styles.channelName}>{video.channel}</h3>
          <p style={styles.channelStats}>1.2M subscribers</p>
        </div>
        <button 
          onClick={handleSubscribe}
          style={{
            ...styles.subscribeButton,
            backgroundColor: subscribed ? '#3f3f3f' : '#ff0000'
          }}
        >
          {subscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      {/* Video Stats */}
      <div style={styles.videoStats}>
        <div style={styles.statsGroup}>
          <button 
            onClick={handleLike}
            style={{
              ...styles.statButton,
              color: liked ? '#3ea6ff' : 'white'
            }}
          >
            <span style={styles.statIcon}>👍</span>
            <span>{video.likes || '12K'}</span>
          </button>
          <button 
            onClick={handleDislike}
            style={{
              ...styles.statButton,
              color: disliked ? '#3ea6ff' : 'white'
            }}
          >
            <span style={styles.statIcon}>👎</span>
          </button>
        </div>
        
        <div style={styles.shareContainer}>
          <button 
            onClick={() => setShowShareMenu(!showShareMenu)}
            style={styles.shareButton}
          >
            <span style={styles.statIcon}>↗️</span>
            <span>Share</span>
          </button>
          
          {showShareMenu && (
            <div style={styles.shareMenu}>
              <button onClick={() => handleShare('copy')} style={styles.shareMenuItem}>
                📋 Copy link
              </button>
              <button onClick={() => handleShare('twitter')} style={styles.shareMenuItem}>
                🐦 Twitter
              </button>
              <button onClick={() => handleShare('facebook')} style={styles.shareMenuItem}>
                📘 Facebook
              </button>
              <button onClick={() => handleShare('whatsapp')} style={styles.shareMenuItem}>
                💬 WhatsApp
              </button>
            </div>
          )}
        </div>
        
        <button style={styles.moreButton}>
          <span style={styles.statIcon}>⋯</span>
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #303030',
    flexWrap: 'wrap',
    gap: '16px',
  },
  channelInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  channelAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#3ea6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '600',
  },
  channelDetails: {
    marginRight: '16px',
  },
  channelName: {
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '2px',
  },
  channelStats: {
    fontSize: '12px',
    color: '#aaa',
  },
  subscribeButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  videoStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statsGroup: {
    display: 'flex',
    backgroundColor: '#272727',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  statButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  statIcon: {
    fontSize: '16px',
  },
  shareContainer: {
    position: 'relative',
  },
  shareButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 16px',
    backgroundColor: '#272727',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    fontSize: '13px',
    cursor: 'pointer',
  },
  shareMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    backgroundColor: '#282828',
    border: '1px solid #3f3f3f',
    borderRadius: '8px',
    padding: '8px 0',
    zIndex: 100,
    minWidth: '160px',
  },
  shareMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '13px',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  moreButton: {
    width: '36px',
    height: '36px',
    backgroundColor: '#272727',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

// Add hover styles
const style = document.createElement('style')
style.textContent = `
  .subscribe-button:hover {
    background-color: ${subscribed => subscribed ? '#4f4f4f' : '#cc0000'} !important;
  }
  .stat-button:hover {
    background-color: #3f3f3f !important;
  }
  .share-button:hover {
    background-color: #3f3f3f !important;
  }
  .share-menu-item:hover {
    background-color: #3f3f3f !important;
  }
  .more-button:hover {
    background-color: #3f3f3f !important;
  }
`
document.head.appendChild(style)