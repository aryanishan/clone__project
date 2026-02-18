import React, { useState } from 'react'
// In Upload.jsx or any component
import { useNotifications } from '../context/NotificationContext'

// Inside your component
const { addNotification } = useNotifications()

// When upload is successful
addNotification({
  type: 'upload',
  channel: 'Your Channel',
  message: 'Your video was uploaded successfully',
  action: 'Video is now live'
})
export default function Upload() {
  const [title, setTitle] = useState('')
  const [channel, setChannel] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: Integrate upload API here. Replace the alert with real upload logic.
    // Example: send `title`, `channel` and file data to your backend API.
    alert(`Uploaded: ${title} by ${channel}`)
    setTitle('')
    setChannel('')
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Channel
          <input value={channel} onChange={(e) => setChannel(e.target.value)} />
        </label>
        <button type="submit">Upload (fake)</button>
      </form>
    </div>
  )
}
