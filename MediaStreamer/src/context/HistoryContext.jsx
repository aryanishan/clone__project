// context/HistoryContext.jsx
import React, { createContext, useContext, useCallback, useState } from 'react'

const HistoryContext = createContext()

export const useHistory = () => {
  const context = useContext(HistoryContext)
  if (!context) throw new Error('useHistory must be used within HistoryProvider')
  return context
}

export const HistoryProvider = ({ children }) => {
  const [watchHistory, setWatchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('watchHistory') || '[]')
    } catch {
      return []
    }
  })

  const persist = (list) => {
    localStorage.setItem('watchHistory', JSON.stringify(list))
    return list
  }

  const addToHistory = useCallback((video) => {
    setWatchHistory(prev =>
      persist([
        { ...video, watchedAt: new Date().toISOString() },
        ...prev.filter(v => v.id !== video.id),
      ].slice(0, 50))
    )
  }, [])

  const removeFromHistory = useCallback((videoId) => {
    setWatchHistory(prev => persist(prev.filter(v => v.id !== videoId)))
  }, [])

  const clearHistory = useCallback(() => {
    setWatchHistory(persist([]))
  }, [])

  return (
    <HistoryContext.Provider value={{ watchHistory, addToHistory, removeFromHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  )
}