// pages/Upload.jsx
import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'

export default function Upload() {
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    channel: '',
    category: 'Entertainment',
    tags: '',
    privacy: 'public',
    language: 'English'
  })
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState({})

  const categories = [
    'Entertainment', 'Music', 'Gaming', 'Education', 'Technology',
    'Sports', 'News', 'Fashion', 'Travel', 'Cooking', 'Vlogs'
  ]

  const privacyOptions = [
    { value: 'public', label: 'Public', icon: '🌐' },
    { value: 'unlisted', label: 'Unlisted', icon: '🔗' },
    { value: 'private', label: 'Private', icon: '🔒' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setThumbnail(file)
      } else {
        alert('Please select an image file for thumbnail')
      }
    }
  }

  const validateAndSetFile = (file) => {
    // Check file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid video file (MP4, WebM, OGG, MOV)')
      return
    }

    // Check file size (limit to 100MB for demo)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      alert('File size exceeds 100MB limit')
      return
    }

    setSelectedFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.channel.trim()) {
      newErrors.channel = 'Channel name is required'
    }
    if (!selectedFile) {
      newErrors.file = 'Please select a video file'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const simulateUpload = () => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        
        if (progress >= 100) {
          clearInterval(interval)
          setTimeout(resolve, 500)
        }
      }, 300)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0]
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    setIsUploading(true)
    
    try {
      // Simulate upload progress
      await simulateUpload()
      
      // Add success notification
      addNotification({
        type: 'upload',
        channel: formData.channel,
        message: 'Your video was uploaded successfully',
        action: formData.title,
        time: 'Just now'
      })

      // Show success message
      alert('Video uploaded successfully! (Demo)')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        channel: '',
        category: 'Entertainment',
        tags: '',
        privacy: 'public',
        language: 'English'
      })
      setSelectedFile(null)
      setThumbnail(null)
      setUploadProgress(0)
      
      // Navigate to home after successful upload
      setTimeout(() => navigate('/'), 1500)
      
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Upload Video</h1>
          <p style={styles.subtitle}>Share your content with the world</p>
        </div>
        <div style={styles.headerActions}>
          <button 
            onClick={() => navigate('/')}
            style={styles.cancelButton}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isUploading}
            style={{
              ...styles.publishButton,
              opacity: isUploading ? 0.7 : 1,
              cursor: isUploading ? 'not-allowed' : 'pointer'
            }}
          >
            {isUploading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Left Column - Form */}
        <div style={styles.formSection}>
          {/* Video File Upload */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Video File</h2>
            
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                ...styles.dropZone,
                borderColor: isDragging ? '#ff0000' : errors.file ? '#ff4444' : '#303030',
                backgroundColor: isDragging ? '#2a2a2a' : '#1a1a1a'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              
              {selectedFile ? (
                <div style={styles.fileInfo}>
                  <span style={styles.fileIcon}>🎬</span>
                  <div style={styles.fileDetails}>
                    <span style={styles.fileName}>{selectedFile.name}</span>
                    <span style={styles.fileSize}>{formatFileSize(selectedFile.size)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                    }}
                    style={styles.removeFileButton}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <span style={styles.uploadIcon}>📁</span>
                  <p style={styles.dropZoneText}>
                    Drag & drop video or <span style={styles.browseText}>browse</span>
                  </p>
                  <p style={styles.dropZoneSubtext}>
                    MP4, WebM, OGG, MOV up to 100MB
                  </p>
                </>
              )}
            </div>
            {errors.file && <p style={styles.errorText}>{errors.file}</p>}
          </div>

          {/* Video Details */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Video Details</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Title <span style={styles.required}>*</span>
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., My Amazing Video"
                style={{
                  ...styles.input,
                  borderColor: errors.title ? '#ff4444' : '#303030'
                }}
              />
              {errors.title && <p style={styles.errorText}>{errors.title}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell viewers about your video"
                rows="4"
                style={styles.textarea}
              />
              <p style={styles.helperText}>
                {formData.description.length}/5000 characters
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Thumbnail
              </label>
              <div style={styles.thumbnailSection}>
                <div 
                  style={styles.thumbnailPreview}
                  onClick={() => document.getElementById('thumbnail-input').click()}
                >
                  {thumbnail ? (
                    <img 
                      src={URL.createObjectURL(thumbnail)} 
                      alt="Thumbnail"
                      style={styles.thumbnailImage}
                    />
                  ) : (
                    <>
                      <span style={styles.thumbnailIcon}>🖼️</span>
                      <span style={styles.thumbnailText}>Upload thumbnail</span>
                    </>
                  )}
                </div>
                <input
                  id="thumbnail-input"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailSelect}
                  style={{ display: 'none' }}
                />
                <p style={styles.helperText}>
                  Recommended: 1280×720px (16:9)
                </p>
              </div>
            </div>
          </div>

          {/* Channel Info */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Channel Information</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Channel Name <span style={styles.required}>*</span>
              </label>
              <input
                id="channel"
                type="text"
                name="channel"
                value={formData.channel}
                onChange={handleInputChange}
                placeholder="Your channel name"
                style={{
                  ...styles.input,
                  borderColor: errors.channel ? '#ff4444' : '#303030'
                }}
              />
              {errors.channel && <p style={styles.errorText}>{errors.channel}</p>}
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., gaming, tutorial, vlog (comma separated)"
                style={styles.input}
              />
              <p style={styles.helperText}>Separate tags with commas</p>
            </div>
          </div>
        </div>

        {/* Right Column - Settings & Preview */}
        <div style={styles.settingsSection}>
          {/* Upload Progress */}
          {isUploading && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Upload Progress</h2>
              <div style={styles.progressContainer}>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${uploadProgress}%`
                    }}
                  />
                </div>
                <p style={styles.progressText}>{uploadProgress}% uploaded</p>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Privacy Settings</h2>
            
            <div style={styles.privacyOptions}>
              {privacyOptions.map(option => (
                <label key={option.value} style={styles.privacyOption}>
                  <input
                    type="radio"
                    name="privacy"
                    value={option.value}
                    checked={formData.privacy === option.value}
                    onChange={handleInputChange}
                    style={styles.radio}
                  />
                  <span style={styles.privacyIcon}>{option.icon}</span>
                  <div style={styles.privacyInfo}>
                    <span style={styles.privacyLabel}>{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Video Preview */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Video Preview</h2>
            
            <div style={styles.previewContainer}>
              {selectedFile ? (
                <video 
                  src={URL.createObjectURL(selectedFile)} 
                  controls
                  style={styles.previewVideo}
                />
              ) : (
                <div style={styles.emptyPreview}>
                  <span style={styles.previewIcon}>🎥</span>
                  <p style={styles.previewText}>
                    Select a video to preview
                  </p>
                </div>
              )}
              
              {formData.title && (
                <div style={styles.previewInfo}>
                  <p style={styles.previewTitle}>{formData.title}</p>
                  <p style={styles.previewChannel}>{formData.channel || 'Your Channel'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Tips */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Upload Tips</h2>
            <ul style={styles.tipsList}>
              <li style={styles.tipItem}>✓ Use descriptive titles for better search</li>
              <li style={styles.tipItem}>✓ Add tags to help viewers find your video</li>
              <li style={styles.tipItem}>✓ Choose an eye-catching thumbnail</li>
              <li style={styles.tipItem}>✓ Write detailed descriptions</li>
              <li style={styles.tipItem}>✓ Select the right category</li>
            </ul>
          </div>

          {/* Requirements */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Requirements</h2>
            <div style={styles.requirements}>
              <div style={styles.requirement}>
                <span style={styles.requirementIcon}>📏</span>
                <span>Max size: 100MB</span>
              </div>
              <div style={styles.requirement}>
                <span style={styles.requirementIcon}>🎬</span>
                <span>Formats: MP4, WebM, OGG, MOV</span>
              </div>
              <div style={styles.requirement}>
                <span style={styles.requirementIcon}>⏱️</span>
                <span>Max duration: 15 minutes</span>
              </div>
              <div style={styles.requirement}>
                <span style={styles.requirementIcon}>🖼️</span>
                <span>Thumbnail: 16:9 ratio</span>
              </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    borderBottom: '1px solid #303030',
    backgroundColor: '#1a1a1a',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#aaa',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
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
  publishButton: {
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
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '24px',
    padding: '24px 32px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  settingsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #303030',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: 'white',
  },
  dropZone: {
    border: '2px dashed #303030',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#1a1a1a',
  },
  uploadIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '12px',
  },
  dropZoneText: {
    fontSize: '16px',
    color: 'white',
    marginBottom: '8px',
  },
  browseText: {
    color: '#ff0000',
    fontWeight: '500',
  },
  dropZoneSubtext: {
    fontSize: '13px',
    color: '#666',
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: '#272727',
    borderRadius: '8px',
  },
  fileIcon: {
    fontSize: '24px',
  },
  fileDetails: {
    flex: 1,
    textAlign: 'left',
  },
  fileName: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '4px',
  },
  fileSize: {
    fontSize: '12px',
    color: '#aaa',
  },
  removeFileButton: {
    width: '32px',
    height: '32px',
    backgroundColor: '#3f3f3f',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#ddd',
  },
  required: {
    color: '#ff4444',
    marginLeft: '4px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#0f0f0f',
    border: '1px solid #303030',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#0f0f0f',
    border: '1px solid #303030',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#0f0f0f',
    border: '1px solid #303030',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
  helperText: {
    fontSize: '12px',
    color: '#666',
    marginTop: '6px',
  },
  errorText: {
    fontSize: '12px',
    color: '#ff4444',
    marginTop: '6px',
  },
  thumbnailSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  thumbnailPreview: {
    width: '200px',
    height: '112px',
    backgroundColor: '#0f0f0f',
    border: '2px dashed #303030',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbnailIcon: {
    fontSize: '24px',
    marginBottom: '4px',
  },
  thumbnailText: {
    fontSize: '12px',
    color: '#aaa',
  },
  privacyOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  privacyOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#0f0f0f',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  radio: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#ff0000',
  },
  privacyIcon: {
    fontSize: '20px',
  },
  privacyInfo: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: '14px',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: '8px',
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#303030',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff0000',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '13px',
    color: '#aaa',
    textAlign: 'center',
  },
  previewContainer: {
    backgroundColor: '#0f0f0f',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  previewVideo: {
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: 'black',
  },
  emptyPreview: {
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: '#0f0f0f',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewIcon: {
    fontSize: '40px',
    marginBottom: '8px',
    opacity: 0.5,
  },
  previewText: {
    fontSize: '13px',
    color: '#666',
  },
  previewInfo: {
    padding: '12px',
    borderTop: '1px solid #303030',
  },
  previewTitle: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '4px',
  },
  previewChannel: {
    fontSize: '12px',
    color: '#aaa',
  },
  tipsList: {
    listStyle: 'none',
    padding: 0,
  },
  tipItem: {
    fontSize: '13px',
    color: '#aaa',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  requirements: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  requirement: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    color: '#aaa',
  },
  requirementIcon: {
    fontSize: '16px',
  },
}

// Add hover styles
const style = document.createElement('style')
style.textContent = `
  .cancel-button:hover {
    background-color: #3f3f3f !important;
  }
  .publish-button:hover {
    background-color: #cc0000 !important;
  }
  .drop-zone:hover {
    border-color: #ff0000 !important;
    background-color: #272727 !important;
  }
  .remove-file-button:hover {
    background-color: #ff4444 !important;
  }
  .input:focus, .textarea:focus, .select:focus {
    border-color: #ff0000 !important;
  }
  .privacy-option:hover {
    background-color: #1a1a1a !important;
  }
  .thumbnail-preview:hover {
    border-color: #ff0000 !important;
  }
`
document.head.appendChild(style)