// pages/Upload.jsx
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Upload() {
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Music')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const CATEGORIES = ['Music','Gaming','News','Sports','Technology','Movies','Learning','Comedy','Fashion','Cooking']

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.type.startsWith('video/')) setFile(dropped)
  }

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) setFile(selected)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file || !title.trim()) return
    setUploading(true)
    // Simulate upload progress
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 12
      if (p >= 100) {
        clearInterval(interval)
        setProgress(100)
        setTimeout(() => navigate('/'), 1200)
      } else {
        setProgress(Math.min(p, 99))
      }
    }, 200)
  }

  const fmt = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <>
      <style>{css}</style>
      <div style={S.page}>
        <h1 style={S.title}>Upload Video</h1>

        {uploading ? (
          /* ── Progress ── */
          <div style={S.progressWrap}>
            <div style={S.progressIcon}>📤</div>
            <h2 style={S.progressTitle}>
              {progress < 100 ? 'Uploading your video…' : '✅ Upload complete!'}
            </h2>
            <p style={S.progressSub}>{file?.name}</p>
            <div style={S.progressBar}>
              <div style={{ ...S.progressFill, width: `${progress}%` }} />
            </div>
            <p style={S.progressPct}>{Math.round(progress)}%</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={S.form}>

            {/* Drop zone */}
            <div
              className={`up-dropzone ${dragOver ? 'up-dragover' : ''}`}
              style={{ ...S.dropzone, borderColor: dragOver ? '#3ea6ff' : '#2a2a2a', background: dragOver ? '#0d1a2a' : '#111' }}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {file ? (
                <div style={S.fileInfo}>
                  <span style={S.fileIcon}>🎬</span>
                  <div>
                    <p style={S.fileName}>{file.name}</p>
                    <p style={S.fileSize}>{fmt(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    style={S.removeFile}
                    onClick={e => { e.stopPropagation(); setFile(null) }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div style={S.uploadIcon}>⬆️</div>
                  <p style={S.dropTitle}>Drag & drop a video file here</p>
                  <p style={S.dropSubtitle}>or click to browse</p>
                  <p style={S.dropHint}>MP4, MOV, AVI, MKV — up to 2 GB</p>
                </>
              )}
            </div>

            {/* Fields */}
            <div style={S.fields}>

              <div style={S.field}>
                <label style={S.label}>Title <span style={S.required}>*</span></label>
                <input
                  className="up-input"
                  type="text"
                  placeholder="Add a title that describes your video"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={100}
                  style={S.input}
                  required
                />
                <span style={S.charCount}>{title.length}/100</span>
              </div>

              <div style={S.field}>
                <label style={S.label}>Description</label>
                <textarea
                  className="up-input"
                  placeholder="Tell viewers about your video…"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  maxLength={5000}
                  rows={5}
                  style={{ ...S.input, resize: 'vertical', minHeight: 120 }}
                />
                <span style={S.charCount}>{description.length}/5000</span>
              </div>

              <div style={S.field}>
                <label style={S.label}>Category</label>
                <select
                  className="up-input"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ ...S.input, cursor: 'pointer' }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={S.field}>
                <label style={S.label}>Visibility</label>
                <div style={S.radioGroup}>
                  {['Public', 'Unlisted', 'Private'].map(opt => (
                    <label key={opt} style={S.radioLabel}>
                      <input type="radio" name="visibility" value={opt} defaultChecked={opt === 'Public'} style={{ accentColor: '#ff0000' }} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Submit */}
            <div style={S.submitRow}>
              <button
                type="button"
                className="up-cancel-btn"
                style={S.cancelBtn}
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="up-submit-btn"
                style={{
                  ...S.submitBtn,
                  opacity: (!file || !title.trim()) ? 0.45 : 1,
                  cursor: (!file || !title.trim()) ? 'not-allowed' : 'pointer',
                }}
                disabled={!file || !title.trim()}
              >
                Upload Video
              </button>
            </div>

          </form>
        )}
      </div>
    </>
  )
}

const css = `
  .up-input:focus     { border-color: #3ea6ff !important; outline: none; }
  .up-dropzone:hover  { border-color: #3ea6ff !important; }
  .up-cancel-btn:hover{ background: #2a2a2a !important; }
  .up-submit-btn:hover:not(:disabled) { background: #cc0000 !important; }
`

const S = {
  page: {
    maxWidth: 740,
    margin: '0 auto',
    padding: '0 4px 48px',
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 28,
    paddingBottom: 16,
    borderBottom: '1px solid #1a1a1a',
  },
  dropzone: {
    border: '2px dashed #2a2a2a',
    borderRadius: 18,
    padding: '52px 32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: 30,
  },
  uploadIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  dropTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 6,
  },
  dropSubtitle: {
    fontSize: 14,
    color: '#3ea6ff',
    marginBottom: 12,
    fontWeight: 600,
  },
  dropHint: {
    fontSize: 12,
    color: '#444',
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    textAlign: 'left',
    justifyContent: 'center',
  },
  fileIcon: {
    fontSize: 36,
  },
  fileName: {
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 4,
    wordBreak: 'break-all',
  },
  fileSize: {
    fontSize: 13,
    color: '#555',
  },
  removeFile: {
    background: '#2a2a2a',
    border: 'none',
    color: '#ff6b6b',
    width: 28, height: 28,
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  form: {},
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    marginBottom: 28,
  },
  field: {
    position: 'relative',
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 700,
    color: '#ccc',
    marginBottom: 8,
  },
  required: {
    color: '#ff6b6b',
    marginLeft: 2,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: '#111',
    border: '1.5px solid #2a2a2a',
    borderRadius: 12,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  charCount: {
    position: 'absolute',
    bottom: 10,
    right: 14,
    fontSize: 11,
    color: '#444',
  },
  radioGroup: {
    display: 'flex',
    gap: 24,
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    color: '#ccc',
    cursor: 'pointer',
  },
  submitRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    padding: '11px 24px',
    background: '#1a1a1a',
    border: '1.5px solid #2a2a2a',
    borderRadius: 24,
    color: '#aaa',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  submitBtn: {
    padding: '11px 28px',
    background: '#ff0000',
    border: 'none',
    borderRadius: 24,
    color: '#fff',
    fontSize: 14,
    fontWeight: 800,
    transition: 'background 0.15s',
  },
  progressWrap: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#111',
    borderRadius: 18,
  },
  progressIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 8,
  },
  progressSub: {
    fontSize: 13,
    color: '#555',
    marginBottom: 28,
  },
  progressBar: {
    height: 6,
    background: '#1a1a1a',
    borderRadius: 3,
    overflow: 'hidden',
    maxWidth: 400,
    margin: '0 auto 12px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ff0000, #ff6b6b)',
    borderRadius: 3,
    transition: 'width 0.2s ease',
  },
  progressPct: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: 700,
  },
}