import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Page.module.css'

const mockVideos = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Sample Video ${i + 1}`,
  channel: `Channel ${(i % 5) + 1}`,
  views: `${(i + 1) * 10}K views`,
  time: `${(i % 12) + 1} days ago`,
  // no thumbnail images — UI will render a placeholder box
}))

export default function Home() {
  const [query, setQuery] = useState('')

  const videos = mockVideos.filter(
    (v) =>
      v.title.toLowerCase().includes(query.toLowerCase()) ||
      v.channel.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>MediaStreamer</h1>
        <input
          className={styles.search}
          placeholder="Search videos or channels"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      <main>
        <div className={styles.grid}>
          {videos.map((v) => (
            <Link to={`/watch/${v.id}`} key={v.id} className={styles.card}>
              <div className={styles.thumb} aria-hidden>
                <span className={styles.playIcon}>▶</span>
              </div>
              <div className={styles.meta}>
                <h3 className={styles.vtitle}>{v.title}</h3>
                <p className={styles.channel}>{v.channel}</p>
                <p className={styles.stats}>
                  {v.views} • {v.time}
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
