import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState(() => {
    const defaults = { name: 'Demo User', channel: 'Demo Channel', videos: 12, avatar: '' }
    try {
      const raw = localStorage.getItem('profile')
      return raw ? JSON.parse(raw) : defaults
    } catch (_) {
      return defaults
    }
  })

  function handleChange(e) {
    const { name, value } = e.target
    setUser((u) => ({ ...u, [name]: value }))
  }

  function save() {
    localStorage.setItem('profile', JSON.stringify(user))
    // small feedback — keep UX simple for now
    alert('Profile saved')
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h2>Your Profile</h2>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div
          aria-hidden
          style={{
            width: 96,
            height: 96,
            borderRadius: 8,
            background: 'linear-gradient(135deg,#222,#111)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          {user.name
            .split(' ')
            .map((s) => s[0])
            .slice(0, 2)
            .join('')}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>
              Name:
              <input
                name="name"
                value={user.name}
                onChange={handleChange}
                style={{ marginLeft: 8 }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 6 }}>
              Channel:
              <input
                name="channel"
                value={user.channel}
                onChange={handleChange}
                style={{ marginLeft: 8 }}
              />
            </label>

            <div>Videos: {user.videos}</div>
          </div>

          <div>
            <button onClick={save}>Save</button>
            <Link to="/upload" style={{ marginLeft: 12 }}>
              Upload
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
