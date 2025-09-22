'use client'

import { useState, useEffect, useCallback } from 'react'
import { Notification, NotificationType, NotificationPriority } from '@/types'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
}

interface NotificationPreferences {
  email: boolean
  push: boolean
  inApp: boolean
  types: {
    property_update: boolean
    offer_received: boolean
    offer_accepted: boolean
    message_received: boolean
    price_change: boolean
    favorite_update: boolean
    system: boolean
  }
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email: true,
  push: true,
  inApp: true,
  types: {
    property_update: true,
    offer_received: true,
    offer_accepted: true,
    message_received: true,
    price_change: false,
    favorite_update: true,
    system: true,
  },
}

export function useNotifications(userId?: string) {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: true,
    error: null,
  })

  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES)

  // Load notifications
  const loadNotifications = useCallback(async (userId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // In a real app, this would fetch from your backend
      const mockNotifications: Notification[] = [
        {
          id: 'notif_1',
          userId,
          type: 'offer_received',
          title: 'New Offer Received',
          message: 'You received an offer of 500 FLOW for your property "Downtown Apartment"',
          priority: 'high',
          isRead: false,
          actionUrl: '/properties/123',
          metadata: { propertyId: '123', offerAmount: '500' },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'notif_2',
          userId,
          type: 'message_received',
          title: 'New Message',
          message: 'John Doe sent you a message about the property listing',
          priority: 'medium',
          isRead: false,
          actionUrl: '/messages/456',
          metadata: { conversationId: '456', senderId: 'user_789' },
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: 'notif_3',
          userId,
          type: 'property_update',
          title: 'Property View Update',
          message: 'Your property "Beach House" has been viewed 15 times this week',
          priority: 'low',
          isRead: true,
          actionUrl: '/properties/789',
          metadata: { propertyId: '789', viewCount: 15 },
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
      ]

      const unreadCount = mockNotifications.filter(n => !n.isRead).length

      setState({
        notifications: mockNotifications,
        unreadCount,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load notifications',
        isLoading: false,
      }))
    }
  }, [])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }))

      // In a real app, this would update the backend
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification => ({
          ...notification,
          isRead: true,
        })),
        unreadCount: 0,
      }))

      // In a real app, this would update the backend
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      setState(prev => {
        const notification = prev.notifications.find(n => n.id === notificationId)
        const wasUnread = notification && !notification.isRead
        
        return {
          ...prev,
          notifications: prev.notifications.filter(n => n.id !== notificationId),
          unreadCount: wasUnread ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount,
        }
      })

      // In a real app, this would delete from the backend
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }, [])

  // Delete all notifications
  const deleteAllNotifications = useCallback(async () => {
    try {
      setState(prev => ({
        ...prev,
        notifications: [],
        unreadCount: 0,
      }))

      // In a real app, this would delete all from the backend
    } catch (error) {
      console.error('Failed to delete all notifications:', error)
    }
  }, [])

  // Create new notification
  const createNotification = useCallback(async (
    type: NotificationType,
    title: string,
    message: string,
    priority: NotificationPriority = 'medium',
    actionUrl?: string,
    metadata?: Record<string, any>
  ) => {
    if (!userId) return

    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      message,
      priority,
      isRead: false,
      actionUrl,
      metadata,
      createdAt: new Date().toISOString(),
    }

    setState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications],
      unreadCount: prev.unreadCount + 1,
    }))

    // In a real app, this would save to the backend
    return notification
  }, [userId])

  // Update notification preferences
  const updateNotificationPreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    try {
      setPreferences(prev => ({ ...prev, ...newPreferences }))
      
      // In a real app, this would save to the backend
    } catch (error) {
      console.error('Failed to update notification preferences:', error)
    }
  }, [])

  // Load preferences
  const loadPreferences = useCallback(async (userId: string) => {
    try {
      // In a real app, this would fetch from the backend
      setPreferences(DEFAULT_PREFERENCES)
    } catch (error) {
      console.error('Failed to load notification preferences:', error)
    }
  }, [])

  // Initialize when userId changes
  useEffect(() => {
    if (userId) {
      loadNotifications(userId)
      loadPreferences(userId)
    }
  }, [userId, loadNotifications, loadPreferences])

  return {
    ...state,
    preferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    createNotification,
    updateNotificationPreferences,
    loadNotifications,
    loadPreferences,
  }
}
