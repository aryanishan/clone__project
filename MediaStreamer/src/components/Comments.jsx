// components/Comments.jsx
import React, { useState } from 'react'

const INITIAL_COMMENTS = [
  { id: 1, author: 'Alex Johnson', avatar: 'AJ', text: 'Still an absolute banger. Never gets old 🔥', likes: 4821, time: '3 days ago' },
  { id: 2, author: 'Sarah K',      avatar: 'SK', text: 'This brings back SO many memories. Pure nostalgia in video form.', likes: 2134, time: '1 week ago' },
  { id: 3, author: 'MusicFan99',   avatar: 'MF', text: 'The algorithm blessed me today. Absolutely legendary content.', likes: 987,  time: '2 weeks ago' },
  { id: 4, author: 'Dana Lee',     avatar: 'DL', text: "I've had this on repeat for an hour and I regret nothing 😂", likes: 543, time: '1 month ago' },
]

const COLORS = ['#3ea6ff','#ff6b6b','#51cf66','#ffd43b','#cc5de8','#ff9f43']
const avatarColor = (t) => COLORS[(t || '?').charCodeAt(0) % COLORS.length]

export default function Comments({ videoId }) {
  const [comments, setComments] = useState(INITIAL_COMMENTS)
  const [newText, setNewText] = useState('')
  const [sortBy, setSortBy] = useState('top')

  const sorted = [...comments].sort((a, b) =>
    sortBy === 'top' ? b.likes - a.likes : b.id - a.id
  )

  const submit = () => {
    if (!newText.trim()) return
    setComments(prev => [
      { id: Date.now(), author: 'You', avatar: 'U', text: newText.trim(), likes: 0, time: 'Just now' },
      ...prev,
    ])
    setNewText('')
  }

  return (
    <>
      <style>{css}</style>
      <div style={S.wrap}>

        {/* Header */}
        <div style={S.header}>
          <h3 style={S.count}>{comments.length} Comments</h3>
          <div style={S.sortRow}>
            <SortIcon />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={S.sortSelect}
            >
              <option value="top">Top comments</option>
              <option value="new">Newest first</option>
            </select>
          </div>
        </div>

        {/* Add comment */}
        <div style={S.addRow}>
          <div style={{ ...S.avatar, background: avatarColor('U') }}>U</div>
          <div style={S.addRight}>
            <input
              className="cm-input"
              type="text"
              placeholder="Add a comment…"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={S.input}
            />
            {newText && (
              <div style={S.addActions}>
                <button className="cm-cancel" style={S.cancelBtn} onClick={() => setNewText('')}>Cancel</button>
                <button className="cm-submit" style={S.submitBtn} onClick={submit}>Comment</button>
              </div>
            )}
          </div>
        </div>

        {/* List */}
        <div style={S.list}>
          {sorted.map(c => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>

      </div>
    </>
  )
}

function CommentItem({ comment: c }) {
  const [liked, setLiked] = useState(false)
  const [showReply, setShowReply] = useState(false)

  return (
    <div style={S.comment}>
      <div style={{ ...S.avatar, background: avatarColor(c.avatar) }}>
        {c.avatar.slice(0, 2)}
      </div>
      <div style={S.commentBody}>
        <p style={S.commentMeta}>
          <span style={S.authorName}>{c.author}</span>
          <span style={S.commentTime}> · {c.time}</span>
        </p>
        <p style={S.commentText}>{c.text}</p>
        <div style={S.commentActions}>
          <button
            className="cm-act"
            style={{ ...S.actBtn, color: liked ? '#3ea6ff' : '#aaa' }}
            onClick={() => setLiked(l => !l)}
          >
            <ThumbIcon />
            <span>{liked ? c.likes + 1 : c.likes > 0 ? c.likes.toLocaleString() : ''}</span>
          </button>
          <button className="cm-act" style={S.actBtn}>
            <ThumbDownIcon />
          </button>
          <button className="cm-act" style={{ ...S.actBtn, fontWeight: 700 }} onClick={() => setShowReply(r => !r)}>
            Reply
          </button>
        </div>
        {showReply && (
          <div style={S.replyBox}>
            <input
              type="text"
              placeholder="Add a reply…"
              style={{ ...S.input, marginTop: 6 }}
              onKeyDown={e => { if (e.key === 'Enter') setShowReply(false) }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const css = `
  .cm-input:focus    { border-bottom-color: #3ea6ff !important; outline: none; }
  .cm-cancel:hover   { background: #2a2a2a !important; color: #fff !important; }
  .cm-submit:hover   { background: #2988cc !important; }
  .cm-act:hover      { background: rgba(255,255,255,0.08) !important; color: #fff !important; }
`

const S = {
  wrap: {
    marginTop: 26,
    paddingTop: 26,
    borderTop: '1px solid #1f1f1f',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  count: {
    fontSize: 17,
    fontWeight: 800,
    color: '#fff',
  },
  sortRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#aaa',
  },
  sortSelect: {
    background: 'transparent',
    border: 'none',
    color: '#aaa',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
  },
  addRow: {
    display: 'flex',
    gap: 14,
    marginBottom: 32,
  },
  avatar: {
    width: 40, height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 800,
    flexShrink: 0,
    color: '#fff',
  },
  addRight: {
    flex: 1,
  },
  input: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1.5px solid #2a2a2a',
    color: '#fff',
    fontSize: 14,
    padding: '8px 0',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  addActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  cancelBtn: {
    padding: '8px 18px',
    background: 'transparent',
    border: 'none',
    color: '#aaa',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    borderRadius: 22,
    transition: 'all 0.15s',
  },
  submitBtn: {
    padding: '8px 20px',
    background: '#3ea6ff',
    border: 'none',
    borderRadius: 22,
    color: '#000',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  comment: {
    display: 'flex',
    gap: 14,
  },
  commentBody: {
    flex: 1,
  },
  commentMeta: {
    marginBottom: 6,
  },
  authorName: {
    fontSize: 13,
    fontWeight: 700,
    color: '#fff',
  },
  commentTime: {
    fontSize: 12,
    color: '#555',
    fontWeight: 400,
  },
  commentText: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 1.7,
    marginBottom: 10,
  },
  commentActions: {
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  },
  actBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: 'none',
    color: '#aaa',
    fontSize: 13,
    cursor: 'pointer',
    padding: '5px 10px',
    borderRadius: 22,
    transition: 'all 0.15s',
  },
  replyBox: {
    marginTop: 8,
  },
}

function SortIcon()     { return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/></svg> }
function ThumbIcon()    { return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg> }
function ThumbDownIcon(){ return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg> }