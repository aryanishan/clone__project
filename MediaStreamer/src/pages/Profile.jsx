// pages/Profile.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from '../context/HistoryContext'

export default function Profile() {
  const [user, setUser] = useState(() => {
    const defaults = { 
      name: 'Demo User', 
      channel: 'Demo Channel', 
      videos: 12,
      avatar: '',
      subscribers: 1250,
      joinedDate: 'January 2024',
      description: 'Content creator passionate about sharing amazing videos. Subscribe for regular updates!'
    }
    try {
      const raw = localStorage.getItem('profile')
      return raw ? JSON.parse(raw) : defaults
    } catch (_) {
      return defaults
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const [showStats, setShowStats] = useState(false)
  const { watchHistory } = useHistory()

  useEffect(() => {
    setEditedUser(user)
  }, [user])

  function handleChange(e) {
    const { name, value } = e.target
    setEditedUser((u) => ({ ...u, [name]: value }))
  }

  function saveChanges() {
    setUser(editedUser)
    localStorage.setItem('profile', JSON.stringify(editedUser))
    setIsEditing(false)
    // Show success message
    alert('Profile updated successfully!')
  }

  function cancelEdit() {
    setEditedUser(user)
    setIsEditing(false)
  }

  // Get user initials for avatar
  const getInitials = () => {
    return user.name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  // Format join date
  const formatJoinDate = (date) => {
    return date
  }

  return (
    <div style={styles.container}>
      {/* Profile Header with Cover */}
      <div style={styles.coverPhoto}>
        <div style={styles.coverOverlay}></div>
      </div>

      {/* Profile Content */}
      <div style={styles.content}>
        {/* Avatar and Basic Info */}
        <div style={styles.profileHeader}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {getInitials()}
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                style={styles.editButton}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div style={styles.profileInfo}>
            {isEditing ? (
              <div style={styles.editForm}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Display Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="Your name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Channel Name</label>
                  <input
                    type="text"
                    name="channel"
                    value={editedUser.channel}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="Your channel name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Description</label>
                  <textarea
                    name="description"
                    value={editedUser.description}
                    onChange={handleChange}
                    style={styles.formTextarea}
                    placeholder="Tell viewers about your channel"
                    rows="3"
                  />
                </div>

                <div style={styles.formActions}>
                  <button onClick={saveChanges} style={styles.saveButton}>
                    Save Changes
                  </button>
                  <button onClick={cancelEdit} style={styles.cancelButton}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 style={styles.name}>{user.name}</h1>
                <p style={styles.channel}>{user.channel}</p>
                <p style={styles.bio}>{user.description}</p>
                
                <div style={styles.statsRow}>
                  <div style={styles.statItem}>
                    <span style={styles.statValue}>{user.videos}</span>
                    <span style={styles.statLabel}>Videos</span>
                  </div>
                  <div style={styles.statDivider}>•</div>
                  <div style={styles.statItem}>
                    <span style={styles.statValue}>{user.subscribers?.toLocaleString()}</span>
                    <span style={styles.statLabel}>Subscribers</span>
                  </div>
                  <div style={styles.statDivider}>•</div>
                  <div style={styles.statItem}>
                    <span style={styles.statValue}>{watchHistory.length}</span>
                    <span style={styles.statLabel}>Watched</span>
                  </div>
                </div>

                <p style={styles.joinDate}>Joined {formatJoinDate(user.joinedDate)}</p>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <Link to="/upload" style={styles.actionButton}>
            <span style={styles.actionIcon}>📤</span>
            <span>Upload Video</span>
          </Link>
          <Link to="/history" style={styles.actionButton}>
            <span style={styles.actionIcon}>📜</span>
            <span>Watch History</span>
          </Link>
          <button 
            onClick={() => setShowStats(!showStats)}
            style={styles.actionButton}
          >
            <span style={styles.actionIcon}>📊</span>
            <span>Channel Stats</span>
          </button>
        </div>

        {/* Channel Statistics Panel */}
        {showStats && (
          <div style={styles.statsPanel}>
            <h3 style={styles.statsTitle}>Channel Statistics</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statsCard}>
                <span style={styles.statsCardValue}>{user.videos}</span>
                <span style={styles.statsCardLabel}>Total Videos</span>
              </div>
              <div style={styles.statsCard}>
                <span style={styles.statsCardValue}>{user.subscribers?.toLocaleString()}</span>
                <span style={styles.statsCardLabel}>Subscribers</span>
              </div>
              <div style={styles.statsCard}>
                <span style={styles.statsCardValue}>{watchHistory.length}</span>
                <span style={styles.statsCardLabel}>Videos Watched</span>
              </div>
              <div style={styles.statsCard}>
                <span style={styles.statsCardValue}>0</span>
                <span style={styles.statsCardLabel}>Total Views</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div style={styles.recentActivity}>
          <h3 style={styles.sectionTitle}>Recent Activity</h3>
          {watchHistory.length > 0 ? (
            <div style={styles.activityList}>
              {watchHistory.slice(0, 3).map(video => (
                <Link to={`/watch/${video.id}`} key={video.id} style={styles.activityItem}>
                  <div style={styles.activityThumb}>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      style={styles.activityThumbImg}
                    />
                  </div>
                  <div style={styles.activityInfo}>
                    <h4 style={styles.activityTitle}>{video.title}</h4>
                    <p style={styles.activityMeta}>{video.channel} • {video.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p style={styles.noActivity}>No watch history yet</p>
          )}
        </div>

        {/* Account Settings */}
        <div style={styles.settings}>
          <h3 style={styles.sectionTitle}>Account Settings</h3>
          <div style={styles.settingsList}>
            <div style={styles.settingItem}>
              <span style={styles.settingIcon}>🔒</span>
              <div style={styles.settingContent}>
                <h4 style={styles.settingTitle}>Privacy</h4>
                <p style={styles.settingDescription}>Manage your privacy settings</p>
              </div>
              <button style={styles.settingButton}>Configure</button>
            </div>
            <div style={styles.settingItem}>
              <span style={styles.settingIcon}>🔔</span>
              <div style={styles.settingContent}>
                <h4 style={styles.settingTitle}>Notifications</h4>
                <p style={styles.settingDescription}>Customize your notification preferences</p>
              </div>
              <button style={styles.settingButton}>Configure</button>
            </div>
            <div style={styles.settingItem}>
              <span style={styles.settingIcon}>🌙</span>
              <div style={styles.settingContent}>
                <h4 style={styles.settingTitle}>Appearance</h4>
                <p style={styles.settingDescription}>Dark mode is enabled</p>
              </div>
              <button style={styles.settingButton}>Change</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    color: 'white',
  },
  coverPhoto: {
    height: '200px',
    background: 'linear-gradient(135deg, #ff0000 0%, #3ea6ff 50%, #ff0000 100%)',
    position: 'relative',
    marginBottom: '80px',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px 40px',
  },
  profileHeader: {
    display: 'flex',
    gap: '32px',
    marginTop: '-80px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3ea6ff, #ff0000)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: '600',
    color: 'white',
    border: '4px solid #0f0f0f',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  editButton: {
    padding: '8px 20px',
    backgroundColor: '#272727',
    color: 'white',
    border: '1px solid #3f3f3f',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  profileInfo: {
    flex: 1,
    paddingTop: '20px',
  },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  channel: {
    fontSize: '16px',
    color: '#aaa',
    marginBottom: '12px',
  },
  bio: {
    fontSize: '14px',
    color: '#ccc',
    lineHeight: '1.6',
    marginBottom: '16px',
    maxWidth: '600px',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
  },
  statLabel: {
    fontSize: '14px',
    color: '#aaa',
  },
  statDivider: {
    color: '#3f3f3f',
    fontSize: '12px',
  },
  joinDate: {
    fontSize: '13px',
    color: '#666',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '500px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#aaa',
  },
  formInput: {
    padding: '10px 12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #303030',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
  },
  formTextarea: {
    padding: '10px 12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #303030',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  saveButton: {
    padding: '10px 24px',
    backgroundColor: '#ff0000',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  cancelButton: {
    padding: '10px 24px',
    backgroundColor: '#272727',
    color: 'white',
    border: '1px solid #3f3f3f',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  quickActions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#272727',
    color: 'white',
    textDecoration: 'none',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  actionIcon: {
    fontSize: '18px',
  },
  statsPanel: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
  },
  statsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  statsCard: {
    backgroundColor: '#0f0f0f',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px solid #303030',
  },
  statsCardValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ff0000',
  },
  statsCardLabel: {
    fontSize: '14px',
    color: '#aaa',
  },
  recentActivity: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  activityItem: {
    display: 'flex',
    gap: '16px',
    textDecoration: 'none',
    color: 'white',
    padding: '12px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    transition: 'background-color 0.2s',
  },
  activityThumb: {
    width: '120px',
    aspectRatio: '16/9',
    backgroundColor: '#222',
    borderRadius: '8px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  activityThumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  activityInfo: {
    flex: 1,
    minWidth: 0,
  },
  activityTitle: {
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '6px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  activityMeta: {
    fontSize: '13px',
    color: '#aaa',
  },
  noActivity: {
    color: '#666',
    fontSize: '14px',
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
  },
  settings: {
    marginBottom: '32px',
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
  },
  settingIcon: {
    fontSize: '24px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f0f',
    borderRadius: '50%',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '2px',
  },
  settingDescription: {
    fontSize: '13px',
    color: '#aaa',
  },
  settingButton: {
    padding: '8px 16px',
    backgroundColor: '#272727',
    color: 'white',
    border: '1px solid #3f3f3f',
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
}

// Add hover effects
const style = document.createElement('style')
style.textContent = `
  .edit-button:hover {
    background-color: #3f3f3f !important;
  }
  .save-button:hover {
    background-color: #cc0000 !important;
  }
  .cancel-button:hover {
    background-color: #3f3f3f !important;
  }
  .action-button:hover {
    background-color: #3f3f3f !important;
  }
  .activity-item:hover {
    background-color: #272727 !important;
  }
  .setting-button:hover {
    background-color: #3f3f3f !important;
  }
  .form-input:focus,
  .form-textarea:focus {
    border-color: #ff0000 !important;
  }
`
document.head.appendChild(style)