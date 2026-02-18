// context/NotificationContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications)
      setNotifications(parsed)
      setUnreadCount(parsed.filter(n => !n.read).length)
    } else {
      // Add some sample notifications
      const sampleNotifications = [
        {
          id: '1',
          type: 'subscription',
          message: 'New video from Star Wars',
          channel: 'Star Wars',
          channelAvatar: 'S',
          time: '2 hours ago',
          read: false,
          videoId: '123',
          videoThumb: 'https://via.placeholder.com/40',
          action: 'uploaded: "The Mandalorian Trailer"'
        },
        {
          id: '2',
          type: 'like',
          message: 'Your video got 1.2K likes',
          channel: 'System',
          time: '1 day ago',
          read: false
        },
        {
          id: '3',
          type: 'comment',
          message: 'John commented: "Great video!"',
          channel: 'John Doe',
          time: '2 days ago',
          read: true
        }
      ]
      setNotifications(sampleNotifications)
      setUnreadCount(2)
      localStorage.setItem('notifications', JSON.stringify(sampleNotifications))
    }
  }, [])

  // Add new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      time: 'Just now',
      read: false,
      ...notification
    }
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 20) // Keep last 20
      localStorage.setItem('notifications', JSON.stringify(updated))
      setUnreadCount(updated.filter(n => !n.read).length)
      return updated
    })
  }

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
      localStorage.setItem('notifications', JSON.stringify(updated))
      setUnreadCount(updated.filter(n => !n.read).length)
      return updated
    })
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }))
      localStorage.setItem('notifications', JSON.stringify(updated))
      setUnreadCount(0)
      return updated
    })
  }

  // Clear all notifications
  const clearAll = () => {
    setNotifications([])
    setUnreadCount(0)
    localStorage.setItem('notifications', JSON.stringify([]))
  }

  // Remove single notification
  const removeNotification = (notificationId) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== notificationId)
      localStorage.setItem('notifications', JSON.stringify(updated))
      setUnreadCount(updated.filter(n => !n.read).length)
      return updated
    })
  }

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      showDropdown,
      setShowDropdown,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      removeNotification
    }}>
      {children}
    </NotificationContext.Provider>
  )
}