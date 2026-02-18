// context/HistoryContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const HistoryContext = createContext()

export const useHistory = () => {
  const context = useContext(HistoryContext)
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider')
  }
  return context
}

export const HistoryProvider = ({ children }) => {
  const [watchHistory, setWatchHistory] = useState([])
  const [loading, setLoading] = useState(true)

  // Load history from localStorage on initial render
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem('watchHistory')
        if (savedHistory) {
          setWatchHistory(JSON.parse(savedHistory))
        }
      } catch (error) {
        console.error('Failed to load watch history:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadHistory()
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('watchHistory', JSON.stringify(watchHistory))
    }
  }, [watchHistory, loading])

  // Add video to history
  const addToHistory = (video) => {
    setWatchHistory(prev => {
      // Remove if already exists (to move it to the top)
      const filtered = prev.filter(v => v.id !== video.id)
      // Add to beginning with timestamp
      return [{
        ...video,
        watchedAt: new Date().toISOString()
      }, ...filtered].slice(0, 50) // Keep only last 50 videos
    })
  }

  // Remove video from history
  const removeFromHistory = (videoId) => {
    setWatchHistory(prev => prev.filter(v => v.id !== videoId))
  }

  // Clear entire history
  const clearHistory = () => {
    setWatchHistory([])
  }

  return (
    <HistoryContext.Provider value={{
      watchHistory,
      loading,
      addToHistory,
      removeFromHistory,
      clearHistory
    }}>
      {children}
    </HistoryContext.Provider>
  )
}