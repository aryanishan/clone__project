import React from 'react'
import { useParams, Link } from 'react-router-dom'
import styles from './Page.module.css'

const mockVideos = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: `Sample Video ${i + 1}`,
  channel: `Channel ${(i % 5) + 1}`,
  description: `This is a description for sample video ${i + 1}.`,
  thumbnail: `https://picsum.photos/seed/${i + 1}/800/450`
}))

export default function Watch() {
  const { id } = useParams()
  const video = mockVideos.find((v) => v.id === id) || mockVideos[0]

  return (
    <div>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div className={styles.player} aria-hidden>
          <div className={styles.playIcon}>▶</div>
        </div>

        <h2 style={{ marginTop: 12 }}>{video.title}</h2>
        <p style={{ color: '#aaa', margin: 0 }}>{video.channel}</p>
        <p style={{ marginTop: 12 }}>{video.description}</p>

        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  )
}
