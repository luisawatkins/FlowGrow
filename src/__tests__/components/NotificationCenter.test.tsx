import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NotificationCenter } from '@/components/NotificationCenter'
import { useNotifications } from '@/hooks/useNotifications'
import { Notification, NotificationType, NotificationPriority } from '@/types'

// Mock the useNotifications hook
jest.mock('@/hooks/useNotifications')
const mockUseNotifications = useNotifications as jest.MockedFunction<typeof useNotifications>

const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: 'user_123',
    type: 'offer_received',
    title: 'New Offer Received',
    message: 'You received an offer of 500 FLOW for your property',
    priority: 'high',
    isRead: false,
    actionUrl: '/properties/123',
    metadata: { propertyId: '123', offerAmount: '500' },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif_2',
    userId: 'user_123',
    type: 'message_received',
    title: 'New Message',
    message: 'John Doe sent you a message',
    priority: 'medium',
    isRead: false,
    actionUrl: '/messages/456',
    metadata: { conversationId: '456' },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif_3',
    userId: 'user_123',
    type: 'property_update',
    title: 'Property View Update',
    message: 'Your property has been viewed 15 times',
    priority: 'low',
    isRead: true,
    actionUrl: '/properties/789',
    metadata: { propertyId: '789' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

const mockMarkAsRead = jest.fn()
const mockMarkAllAsRead = jest.fn()
const mockDeleteNotification = jest.fn()
const mockDeleteAllNotifications = jest.fn()
const mockUpdateNotificationPreferences = jest.fn()

describe('NotificationCenter', () => {
  beforeEach(() => {
    mockUseNotifications.mockReturnValue({
      notifications: mockNotifications,
      unreadCount: 2,
      isLoading: false,
      error: null,
      preferences: {
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
      },
      markAsRead: mockMarkAsRead,
      markAllAsRead: mockMarkAllAsRead,
      deleteNotification: mockDeleteNotification,
      deleteAllNotifications: mockDeleteAllNotifications,
      createNotification: jest.fn(),
      updateNotificationPreferences: mockUpdateNotificationPreferences,
      loadNotifications: jest.fn(),
      loadPreferences: jest.fn(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders notification center with notifications', () => {
    render(<NotificationCenter userId="user_123" />)
    
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('2 unread notifications')).toBeInTheDocument()
    expect(screen.getByText('New Offer Received')).toBeInTheDocument()
    expect(screen.getByText('New Message')).toBeInTheDocument()
    expect(screen.getByText('Property View Update')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 0,
      isLoading: true,
      error: null,
      preferences: {} as any,
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      deleteNotification: jest.fn(),
      deleteAllNotifications: jest.fn(),
      createNotification: jest.fn(),
      updateNotificationPreferences: jest.fn(),
      loadNotifications: jest.fn(),
      loadPreferences: jest.fn(),
    })

    render(<NotificationCenter userId="user_123" />)
    
    expect(screen.getByText('Loading notifications...')).toBeInTheDocument()
  })

  it('shows all caught up message when no unread notifications', () => {
    mockUseNotifications.mockReturnValue({
      notifications: mockNotifications,
      unreadCount: 0,
      isLoading: false,
      error: null,
      preferences: {} as any,
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      deleteNotification: jest.fn(),
      deleteAllNotifications: jest.fn(),
      createNotification: jest.fn(),
      updateNotificationPreferences: jest.fn(),
      loadNotifications: jest.fn(),
      loadPreferences: jest.fn(),
    })

    render(<NotificationCenter userId="user_123" />)
    
    expect(screen.getByText('All caught up!')).toBeInTheDocument()
  })

  it('filters notifications by unread status', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const filterSelect = screen.getByDisplayValue('All')
    fireEvent.change(filterSelect, { target: { value: 'unread' } })
    
    expect(screen.getByText('New Offer Received')).toBeInTheDocument()
    expect(screen.getByText('New Message')).toBeInTheDocument()
    expect(screen.queryByText('Property View Update')).not.toBeInTheDocument()
  })

  it('filters notifications by read status', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const filterSelect = screen.getByDisplayValue('All')
    fireEvent.change(filterSelect, { target: { value: 'read' } })
    
    expect(screen.queryByText('New Offer Received')).not.toBeInTheDocument()
    expect(screen.queryByText('New Message')).not.toBeInTheDocument()
    expect(screen.getByText('Property View Update')).toBeInTheDocument()
  })

  it('filters notifications by important priority', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const filterSelect = screen.getByDisplayValue('All')
    fireEvent.change(filterSelect, { target: { value: 'important' } })
    
    expect(screen.getByText('New Offer Received')).toBeInTheDocument()
    expect(screen.queryByText('New Message')).not.toBeInTheDocument()
    expect(screen.queryByText('Property View Update')).not.toBeInTheDocument()
  })

  it('searches notifications by title and message', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const searchInput = screen.getByPlaceholderText('Search notifications...')
    fireEvent.change(searchInput, { target: { value: 'offer' } })
    
    expect(screen.getByText('New Offer Received')).toBeInTheDocument()
    expect(screen.queryByText('New Message')).not.toBeInTheDocument()
    expect(screen.queryByText('Property View Update')).not.toBeInTheDocument()
  })

  it('sorts notifications by newest first', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const sortSelect = screen.getByDisplayValue('Newest First')
    fireEvent.change(sortSelect, { target: { value: 'newest' } })
    
    // Should maintain newest first order
    const notifications = screen.getAllByText(/New Offer Received|New Message|Property View Update/)
    expect(notifications[0]).toHaveTextContent('New Offer Received')
  })

  it('sorts notifications by oldest first', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const sortSelect = screen.getByDisplayValue('Newest First')
    fireEvent.change(sortSelect, { target: { value: 'oldest' } })
    
    // Should show oldest first
    const notifications = screen.getAllByText(/New Offer Received|New Message|Property View Update/)
    expect(notifications[0]).toHaveTextContent('Property View Update')
  })

  it('sorts notifications by priority', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const sortSelect = screen.getByDisplayValue('Newest First')
    fireEvent.change(sortSelect, { target: { value: 'priority' } })
    
    // Should show high priority first
    const notifications = screen.getAllByText(/New Offer Received|New Message|Property View Update/)
    expect(notifications[0]).toHaveTextContent('New Offer Received')
  })

  it('marks all notifications as read', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const markAllReadButton = screen.getByText('Mark All Read')
    fireEvent.click(markAllReadButton)
    
    expect(mockMarkAllAsRead).toHaveBeenCalled()
  })

  it('deletes all notifications', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const clearAllButton = screen.getByText('Clear All')
    fireEvent.click(clearAllButton)
    
    expect(mockDeleteAllNotifications).toHaveBeenCalled()
  })

  it('disables mark all read button when no unread notifications', () => {
    mockUseNotifications.mockReturnValue({
      notifications: mockNotifications,
      unreadCount: 0,
      isLoading: false,
      error: null,
      preferences: {} as any,
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      deleteNotification: jest.fn(),
      deleteAllNotifications: jest.fn(),
      createNotification: jest.fn(),
      updateNotificationPreferences: jest.fn(),
      loadNotifications: jest.fn(),
      loadPreferences: jest.fn(),
    })

    render(<NotificationCenter userId="user_123" />)
    
    const markAllReadButton = screen.getByText('Mark All Read')
    expect(markAllReadButton).toBeDisabled()
  })

  it('disables clear all button when no notifications', () => {
    mockUseNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      preferences: {} as any,
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      deleteNotification: jest.fn(),
      deleteAllNotifications: jest.fn(),
      createNotification: jest.fn(),
      updateNotificationPreferences: jest.fn(),
      loadNotifications: jest.fn(),
      loadPreferences: jest.fn(),
    })

    render(<NotificationCenter userId="user_123" />)
    
    const clearAllButton = screen.getByText('Clear All')
    expect(clearAllButton).toBeDisabled()
  })

  it('shows notification icons based on type', () => {
    render(<NotificationCenter userId="user_123" />)
    
    expect(screen.getByText('💰')).toBeInTheDocument() // offer_received
    expect(screen.getByText('💬')).toBeInTheDocument() // message_received
    expect(screen.getByText('🏠')).toBeInTheDocument() // property_update
  })

  it('shows priority-based styling', () => {
    render(<NotificationCenter userId="user_123" />)
    
    // High priority notification should have red styling
    const highPriorityNotification = screen.getByText('New Offer Received').closest('div')
    expect(highPriorityNotification).toHaveClass('border-l-red-500')
  })

  it('shows unread indicator for unread notifications', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const unreadIndicators = screen.getAllByRole('generic').filter(el => 
      el.classList.contains('w-2') && el.classList.contains('h-2') && el.classList.contains('bg-blue-600')
    )
    expect(unreadIndicators).toHaveLength(2) // Two unread notifications
  })

  it('handles bulk selection of notifications', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i })
    fireEvent.click(selectAllCheckbox)
    
    expect(screen.getByText('3 notifications selected')).toBeInTheDocument()
  })

  it('performs bulk actions on selected notifications', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i })
    fireEvent.click(selectAllCheckbox)
    
    const markAsReadButton = screen.getByText('Mark as Read')
    fireEvent.click(markAsReadButton)
    
    expect(mockMarkAsRead).toHaveBeenCalledTimes(3)
  })

  it('shows no notifications message when empty', () => {
    mockUseNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      preferences: {} as any,
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      deleteNotification: jest.fn(),
      deleteAllNotifications: jest.fn(),
      createNotification: jest.fn(),
      updateNotificationPreferences: jest.fn(),
      loadNotifications: jest.fn(),
      loadPreferences: jest.fn(),
    })

    render(<NotificationCenter userId="user_123" />)
    
    expect(screen.getByText('No notifications yet')).toBeInTheDocument()
    expect(screen.getByText('You\'ll receive notifications about property updates, offers, and messages here.')).toBeInTheDocument()
  })

  it('shows no matching notifications when filters return no results', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const searchInput = screen.getByPlaceholderText('Search notifications...')
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
    
    expect(screen.getByText('No matching notifications')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search or filter criteria.')).toBeInTheDocument()
  })

  it('displays notification timestamps', () => {
    render(<NotificationCenter userId="user_123" />)
    
    // Should show formatted timestamps
    const timestamps = screen.getAllByText(/\d{1,2}:\d{2}/)
    expect(timestamps.length).toBeGreaterThan(0)
  })

  it('opens action URL when view button is clicked', () => {
    const mockOpen = jest.fn()
    window.open = mockOpen
    
    render(<NotificationCenter userId="user_123" />)
    
    const viewButtons = screen.getAllByText('View')
    fireEvent.click(viewButtons[0])
    
    expect(mockOpen).toHaveBeenCalledWith('/properties/123', '_blank')
  })

  it('deletes individual notification', () => {
    render(<NotificationCenter userId="user_123" />)
    
    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])
    
    expect(mockDeleteNotification).toHaveBeenCalledWith('notif_1')
  })
})
