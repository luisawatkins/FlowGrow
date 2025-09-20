'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationToastProps {
  notification: Notification
  onRemove: (id: string) => void
}

export function NotificationToast({ notification, onRemove }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    
    // Auto remove after duration
    const removeTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onRemove(notification.id), 300) // Wait for animation
    }, notification.duration || 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(removeTimer)
    }
  }, [notification.id, notification.duration, onRemove])

  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800'
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800'
    }
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Card className={`w-80 ${getTypeStyles()}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="text-lg">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <p className="text-sm mt-1">{notification.message}</p>
              {notification.action && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={notification.action.onClick}
                >
                  {notification.action.label}
                </Button>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onRemove(notification.id), 300)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Notification context and provider
import { createContext, useContext, useCallback, useState as useReactState } from 'react'

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useReactState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { ...notification, id }])
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
