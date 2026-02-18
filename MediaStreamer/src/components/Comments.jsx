// components/Comments.jsx
import React, { useState } from 'react'

export default function Comments({ videoId }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Doe',
      avatar: 'JD',
      text: 'Amazing video! Really enjoyed the content. 🔥',
      timestamp: '2 hours ago',
      likes: 245,
      replies: 12
    },
    {
      id: 2,
      author: 'Jane Smith',
      avatar: 'JS',
      text: 'First time watching your channel. Subscribed! 👍',
      timestamp: '5 hours ago',
      likes: 89,
      replies: 3
    },
    {
      id: 3,
      author: 'Mike Johnson',
      avatar: 'MJ',
      text: 'The editing is top notch. Keep up the great work!',
      timestamp: '1 day ago',
      likes: 567,
      replies: 23
    }
  ])
  
  const [newComment, setNewComment] = useState('')
  const [sortBy, setSortBy] = useState('top')

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    const comment = {
      id: Date.now(),
      author: 'You',
      avatar: 'U',
      text: newComment,
      timestamp: 'Just now',
      likes: 0,
      replies: 0
    }
    
    setComments([comment, ...comments])
    setNewComment('')
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'top') return b.likes - a.likes
    return new Date(b.timestamp) - new Date(a.timestamp)
  })

  return (
    <div style={styles.container}>
      {/* Comments Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>{comments.length} Comments</h3>
        <div style={styles.sortContainer}>
          <span style={styles.sortIcon}>↕️</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="top">Top comments</option>
            <option value="newest">Newest first</option>
          </select>
        </div>
      </div>

      {/* Add Comment */}
      <form onSubmit={handleSubmitComment} style={styles.addComment}>
        <div style={styles.commentAvatar}>U</div>
        <div style={styles.commentInputContainer}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={styles.commentInput}
          />
          <div style={styles.commentActions}>
            <button 
              type="button"
              onClick={() => setNewComment('')}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!newComment.trim()}
              style={{
                ...styles.submitButton,
                opacity: !newComment.trim() ? 0.5 : 1,
                cursor: !newComment.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              Comment
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div style={styles.commentsList}>
        {sortedComments.map(comment => (
          <div key={comment.id} style={styles.comment}>
            <div style={styles.commentAvatar}>
              {comment.avatar}
            </div>
            <div style={styles.commentContent}>
              <div style={styles.commentHeader}>
                <span style={styles.commentAuthor}>{comment.author}</span>
                <span style={styles.commentTime}>{comment.timestamp}</span>
              </div>
              <p style={styles.commentText}>{comment.text}</p>
              <div style={styles.commentFooter}>
                <button style={styles.commentAction}>
                  <span style={styles.actionIcon}>👍</span>
                  <span>{comment.likes}</span>
                </button>
                <button style={styles.commentAction}>
                  <span style={styles.actionIcon}>👎</span>
                </button>
                <button style={styles.replyButton}>Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #303030',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
  },
  sortContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sortIcon: {
    fontSize: '16px',
  },
  sortSelect: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#aaa',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
  },
  addComment: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
  },
  commentAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3ea6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
    flexShrink: 0,
  },
  commentInputContainer: {
    flex: 1,
  },
  commentInput: {
    width: '100%',
    padding: '8px 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid #303030',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '8px',
  },
  commentActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#aaa',
    border: 'none',
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '8px 16px',
    backgroundColor: '#ff0000',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  comment: {
    display: 'flex',
    gap: '16px',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  commentAuthor: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'white',
  },
  commentTime: {
    fontSize: '11px',
    color: '#666',
  },
  commentText: {
    fontSize: '13px',
    color: '#ddd',
    marginBottom: '8px',
    lineHeight: '1.5',
  },
  commentFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  commentAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#aaa',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '20px',
  },
  actionIcon: {
    fontSize: '14px',
  },
  replyButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#aaa',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '4px 8px',
  },
}

// Add hover styles
const style = document.createElement('style')
style.textContent = `
  .comment-input:focus {
    border-bottom-color: #3ea6ff !important;
  }
  .cancel-button:hover {
    background-color: #272727 !important;
    color: white !important;
  }
  .submit-button:hover:not(:disabled) {
    background-color: #cc0000 !important;
  }
  .comment-action:hover {
    background-color: #272727 !important;
    color: white !important;
  }
  .reply-button:hover {
    color: white !important;
  }
`
document.head.appendChild(style)