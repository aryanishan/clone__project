// context/SearchHistoryContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const SearchHistoryContext = createContext()

export const useSearchHistory = () => {
  const context = useContext(SearchHistoryContext)
  if (!context) {
    throw new Error('useSearchHistory must be used within a SearchHistoryProvider')
  }
  return context
}

export const SearchHistoryProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState([])
  const [loading, setLoading] = useState(true)

  // Load search history from localStorage
  useEffect(() => {
    const loadSearchHistory = () => {
      try {
        const savedHistory = localStorage.getItem('searchHistory')
        if (savedHistory) {
          setSearchHistory(JSON.parse(savedHistory))
        }
      } catch (error) {
        console.error('Failed to load search history:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadSearchHistory()
  }, [])

  // Save search history to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
    }
  }, [searchHistory, loading])

  // Add search query to history
  const addToSearchHistory = (query) => {
    if (!query.trim()) return

    setSearchHistory(prev => {
      // Remove if already exists (to move it to the top)
      const filtered = prev.filter(item => 
        item.query.toLowerCase() !== query.toLowerCase()
      )
      
      // Add to beginning with timestamp
      return [{
        id: Date.now().toString(),
        query: query.trim(),
        timestamp: new Date().toISOString()
      }, ...filtered].slice(0, 20) // Keep only last 20 searches
    })
  }

  // Remove search from history
  const removeFromSearchHistory = (searchId) => {
    setSearchHistory(prev => prev.filter(item => item.id !== searchId))
  }

  // Clear all search history
  const clearSearchHistory = () => {
    setSearchHistory([])
  }

  // Get popular searches (most frequent)
  const getPopularSearches = (limit = 5) => {
    const frequency = {}
    searchHistory.forEach(item => {
      frequency[item.query] = (frequency[item.query] || 0) + 1
    })
    
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query]) => query)
  }

  // Get recent searches
  const getRecentSearches = (limit = 5) => {
    return searchHistory.slice(0, limit).map(item => item.query)
  }

  return (
    <SearchHistoryContext.Provider value={{
      searchHistory,
      loading,
      addToSearchHistory,
      removeFromSearchHistory,
      clearSearchHistory,
      getPopularSearches,
      getRecentSearches
    }}>
      {children}
    </SearchHistoryContext.Provider>
  )
}