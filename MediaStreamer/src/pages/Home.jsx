import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import styles from './Page.module.css'
import { fetchTrending, searchVideos } from '../lib/api'

const fallback = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: `Sample Video ${i + 1}`,
  channel: `Channel ${(i % 5) + 1}`,
  views: `${(i + 1) * 10}K views`,
  time: `${(i % 12) + 1} days ago`,
  description: '',
  thumbnail: `https://picsum.photos/seed/${i + 1}/320/180`,
}))

export default function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('search')
  const [videos, setVideos] = useState(fallback)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchTrending()
      .then((list) => {
        if (!cancelled && list.length) setVideos(list)
      })
      .catch(() => {
        // keep fallback on error
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let loadingTimer = null
    const t = setTimeout(() => {
      if (!query) {
        fetchTrending()
          .then((list) => !cancelled && list.length && setVideos(list))
          .catch(() => {
            if (!cancelled) setVideos(fallback)
          })
        return
      }

      loadingTimer = setTimeout(() => setLoading(true), 0)
      searchVideos(query)
        .then((list) => {
          if (cancelled) return
          if (list && list.length) setVideos(list)
          else {
            const q = query.toLowerCase()
            setVideos(
              fallback.filter(
                (v) => v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q)
              )
            )
          }
        })
        .catch(() => {
          if (cancelled) return
          const q = query.toLowerCase()
          setVideos(
            fallback.filter(
              (v) => v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q)
            )
          )
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(t)
      if (loadingTimer) clearTimeout(loadingTimer)
    }
  }, [query])

  return (
    <div className={styles.container}>
      {/* Removed internal header/search input as Navbar handles it */}

      <main>
        <div style={{ marginBottom: 8, color: '#bbb' }}>
          {loading ? 'Loading...' : query ? `Results for "${query}"` : 'Trending Videos'}
        </div>

        <div className={styles.grid}>
          {videos.map((v) => (
            <Link to={`/watch/${v.id}`} key={v.id} className={styles.card}>
              <div className={styles.thumb} aria-hidden>
                {v.thumbnail ? (
                  <img src={v.thumbnail} alt={v.title} className={styles.thumbImg} />
                ) : (
                  <span className={styles.playIcon}>▶</span>
                )}
              </div>
              <div className={styles.meta}>
                <h3 className={styles.vtitle}>{v.title}</h3>
                <p className={styles.channel}>{v.channel}</p>
                <p className={styles.stats}>
                  {v.views} • {new Date(v.time).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {videos.length === 0 && <p className={styles.noResults}>No videos found.</p>}
      </main>
    </div>
  )
}
