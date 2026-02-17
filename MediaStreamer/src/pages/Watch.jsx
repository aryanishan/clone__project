import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import styles from './Page.module.css'
import { getVideo, searchVideos } from '../lib/api'
import Navbar from '../components/Navbar'

export default function Watch() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getVideo(id)
      .then((v) => {
        if (!cancelled && v) {
          setVideo(v)
          // Fetch related/recommended videos using a search by title as a simple proxy
          searchVideos(v.title)
            .then((list) => !cancelled && setRelated(list))
            .catch(() => {
              /* ignore related fetch errors */
            })
        }
      })
      .catch(() => {
        // keep null on error
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '1.5rem' }}>
        <div className={styles.player} aria-hidden>
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${id}?autoplay=1`} 
            title={video?.title || 'Video player'}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            style={{ borderRadius: 12 }}
          ></iframe>
        </div>

        <h2 style={{ marginTop: 12 }}>{loading ? 'Loading...' : video?.title || 'Video not found'}</h2>
        <p style={{ color: '#aaa', margin: 0 }}>{video?.channel}</p>
        <p style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{video?.description}</p>

        <hr style={{ borderColor: '#333', margin: '20px 0' }} />
        
        <h3>Recommended</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {related.map(v => (
            <Link to={`/watch/${v.id}`} key={v.id} style={{ textDecoration: 'none', color: 'white' }}>
              <div style={{ aspectRatio: '16/9', backgroundColor: '#222', borderRadius: 8, overflow: 'hidden' }}>
                <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: 'bold', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {v.title}
                </div>
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                  {v.channel}
                </div>
                <div style={{ fontSize: 12, color: '#aaa' }}>
                  {v.time}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
