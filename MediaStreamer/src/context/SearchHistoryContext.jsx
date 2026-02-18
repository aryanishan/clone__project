// context/SearchHistoryContext.jsx
import React, { createContext, useContext, useCallback, useState } from 'react'

const SearchHistoryContext = createContext()

export const useSearchHistory = () => {
  const context = useContext(SearchHistoryContext)
  if (!context) throw new Error('useSearchHistory must be used within SearchHistoryProvider')
  return context
}

export const SearchHistoryProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]')
    } catch {
      return []
    }
  })

  const persist = (list) => {
    localStorage.setItem('searchHistory', JSON.stringify(list))
    return list
  }

  const addToSearchHistory = useCallback((query) => {
    if (!query?.trim()) return
    setSearchHistory(prev =>
      persist([
        { id: Date.now(), query: query.trim(), timestamp: new Date().toISOString() },
        ...prev.filter(i => i.query !== query.trim()),
      ].slice(0, 30))
    )
  }, [])

  const removeFromSearchHistory = useCallback((id) => {
    setSearchHistory(prev => persist(prev.filter(i => i.id !== id)))
  }, [])

  const clearSearchHistory = useCallback(() => {
    setSearchHistory(persist([]))
  }, [])

  const getPopularSearches = useCallback((limit = 5) => {
    return searchHistory.slice(0, limit).map(i => i.query)
  }, [searchHistory])

  return (
    <SearchHistoryContext.Provider value={{
      searchHistory,
      addToSearchHistory,
      removeFromSearchHistory,
      clearSearchHistory,
      getPopularSearches,
    }}>
      {children}
    </SearchHistoryContext.Provider>
  )
}