// context/NotificationContext.jsx
import React, { createContext, useContext, useCallback, useState } from 'react'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used within NotificationProvider')
  return context
}

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    type: 'upload',
    channel: 'Rick Astley',
    channelAvatar: 'RA',
    message: 'uploaded a new video: Never Gonna Give You Up – Remastered 4K',
    time: '2 hours ago',
    read: false,
    videoId: 'dQw4w9WgXcQ',
    videoThumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
  },
  {
    id: 2,
    type: 'subscription',
    channel: 'Ed Sheeran',
    channelAvatar: 'ES',
    message: 'is live now — Acoustic Evening 🎸',
    time: '5 hours ago',
    read: false,
    videoId: 'JGwWNGJdvx8',
    videoThumb: 'https://img.youtube.com/vi/JGwWNGJdvx8/mqdefault.jpg',
  },
  {
    id: 3,
    type: 'upload',
    channel: 'Mark Ronson',
    channelAvatar: 'MR',
    message: 'posted: Behind the scenes of Uptown Funk 🎥',
    time: '1 day ago',
    read: true,
    videoId: 'OPf0YbXqDm0',
    videoThumb: 'https://img.youtube.com/vi/OPf0YbXqDm0/mqdefault.jpg',
  },
]

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('notifications')
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS
    } catch {
      return DEFAULT_NOTIFICATIONS
    }
  })

  const persist = (list) => {
    localStorage.setItem('notifications', JSON.stringify(list))
    return list
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = useCallback((notification) => {
    setNotifications(prev =>
      persist([{ id: Date.now(), ...notification, time: 'Just now', read: false }, ...prev].slice(0, 20))
    )
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications(prev => persist(prev.map(n => n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => persist(prev.map(n => ({ ...n, read: true }))))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications(persist([]))
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => persist(prev.filter(n => n.id !== id)))
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      removeNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}