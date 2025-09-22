'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Notification, NotificationType, NotificationPriority } from '@/types'
import { useNotifications } from '@/hooks/useNotifications'

interface NotificationCenterProps {
  userId: string
  className?: string
}

type NotificationFilter = 'all' | 'unread' | 'read' | 'important'
type NotificationSort = 'newest' | 'oldest' | 'priority'

export function NotificationCenter({ userId, className = '' }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    updateNotificationPreferences,
  } = useNotifications(userId)

  const [filter, setFilter] = useState<NotificationFilter>('all')
  const [sort, setSort] = useState<NotificationSort>('newest')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set())

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      const matchesFilter = filter === 'all' || 
        (filter === 'unread' && !notification.isRead) ||
        (filter === 'read' && notification.isRead) ||
        (filter === 'important' && notification.priority === 'high')
      
      const matchesSearch = searchTerm === '' ||
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev)
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId)
      } else {
        newSet.add(notificationId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set())
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)))
    }
  }

  const handleBulkAction = async (action: 'read' | 'delete') => {
    const selectedIds = Array.from(selectedNotifications)
    
    if (action === 'read') {
      await Promise.all(selectedIds.map(id => markAsRead(id)))
    } else if (action === 'delete') {
      await Promise.all(selectedIds.map(id => deleteNotification(id)))
    }
    
    setSelectedNotifications(new Set())
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'property_update':
        return '🏠'
      case 'offer_received':
        return '💰'
      case 'offer_accepted':
        return '✅'
      case 'message_received':
        return '💬'
      case 'price_change':
        return '📈'
      case 'favorite_update':
        return '❤️'
      case 'system':
        return '🔔'
      default:
        return '📢'
    }
  }

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-l-blue-500 bg-blue-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark All Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deleteAllNotifications}
                disabled={notifications.length === 0}
              >
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as NotificationFilter)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="important">Important</option>
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as NotificationSort)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.size > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">
                {selectedNotifications.size} notification{selectedNotifications.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('read')}
                >
                  Mark as Read
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {notifications.length === 0 ? 'No notifications yet' : 'No matching notifications'}
              </h3>
              <p className="text-gray-600">
                {notifications.length === 0 
                  ? 'You\'ll receive notifications about property updates, offers, and messages here.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Select All */}
              <div className="flex items-center space-x-2 p-2 border-b">
                <input
                  type="checkbox"
                  checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>

              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  isSelected={selectedNotifications.has(notification.id)}
                  onSelect={() => handleSelectNotification(notification.id)}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onDelete={() => deleteNotification(notification.id)}
                  getNotificationIcon={getNotificationIcon}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  isSelected: boolean
  onSelect: () => void
  onMarkAsRead: () => void
  onDelete: () => void
  getNotificationIcon: (type: NotificationType) => string
  getPriorityColor: (priority: NotificationPriority) => string
}

function NotificationItem({
  notification,
  isSelected,
  onSelect,
  onMarkAsRead,
  onDelete,
  getNotificationIcon,
  getPriorityColor,
}: NotificationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead()
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={`border-l-4 p-4 rounded-r-lg transition-all ${
        notification.isRead ? 'bg-white' : 'bg-blue-50'
      } ${getPriorityColor(notification.priority)} ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="mt-1 rounded"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
            <h4 className={`font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
              {notification.title}
            </h4>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </div>
          
          <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
            
            <div className="flex items-center space-x-2">
              {notification.actionUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(notification.actionUrl, '_blank')}
                >
                  View
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
