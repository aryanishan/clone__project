import React, { useState } from 'react'

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
