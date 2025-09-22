import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MessagingSystem } from '@/components/MessagingSystem'
import { useMessaging } from '@/hooks/useMessaging'
import { Conversation, Message, Participant } from '@/types'

// Mock the useMessaging hook
jest.mock('@/hooks/useMessaging')
const mockUseMessaging = useMessaging as jest.MockedFunction<typeof useMessaging>

const mockParticipants: Participant[] = [
  { id: 'user_123', name: 'You', isOnline: true },
  { id: 'user_2', name: 'John Doe', isOnline: true },
  { id: 'user_3', name: 'Jane Smith', isOnline: false },
]

const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    participants: [mockParticipants[0], mockParticipants[1]],
    title: 'Chat with John Doe',
    lastMessage: {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'user_2',
      content: 'Hi! I\'m interested in your property.',
      type: 'text',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    unreadCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'conv_2',
    participants: [mockParticipants[0], mockParticipants[2]],
    title: 'Chat with Jane Smith',
    lastMessage: {
      id: 'msg_2',
      conversationId: 'conv_2',
      senderId: 'user_123',
      content: 'Thank you for your interest!',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

const mockMessages: Record<string, Message[]> = {
  'conv_1': [
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'user_2',
      content: 'Hi! I\'m interested in your property.',
      type: 'text',
      isRead: false,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'msg_2',
      conversationId: 'conv_1',
      senderId: 'user_123',
      content: 'Hello! Yes, I\'d be happy to help.',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1200000).toISOString(),
    },
  ],
}

const mockSendMessage = jest.fn()
const mockCreateConversation = jest.fn()
const mockMarkAsRead = jest.fn()
const mockDeleteConversation = jest.fn()
const mockLoadMessages = jest.fn()

describe('MessagingSystem', () => {
  beforeEach(() => {
    mockUseMessaging.mockReturnValue({
      conversations: mockConversations,
      activeConversation: null,
      messages: mockMessages,
      isLoading: false,
      error: null,
      sendMessage: mockSendMessage,
      createConversation: mockCreateConversation,
      markAsRead: mockMarkAsRead,
      deleteConversation: mockDeleteConversation,
      loadMessages: mockLoadMessages,
      getConversation: jest.fn(),
      getUnreadCount: jest.fn(),
      getTotalUnreadCount: jest.fn(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders messaging system with conversations', () => {
    render(<MessagingSystem userId="user_123" />)
    
    expect(screen.getByText('Messages')).toBeInTheDocument()
    expect(screen.getByText('Chat with John Doe')).toBeInTheDocument()
    expect(screen.getByText('Chat with Jane Smith')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseMessaging.mockReturnValue({
      conversations: [],
      activeConversation: null,
      messages: {},
      isLoading: true,
      error: null,
      sendMessage: jest.fn(),
      createConversation: jest.fn(),
      markAsRead: jest.fn(),
      deleteConversation: jest.fn(),
      loadMessages: jest.fn(),
      getConversation: jest.fn(),
      getUnreadCount: jest.fn(),
      getTotalUnreadCount: jest.fn(),
    })

    render(<MessagingSystem userId="user_123" />)
    
    expect(screen.getByText('Loading messages...')).toBeInTheDocument()
  })

  it('shows no conversations message when empty', () => {
    mockUseMessaging.mockReturnValue({
      conversations: [],
      activeConversation: null,
      messages: {},
      isLoading: false,
      error: null,
      sendMessage: jest.fn(),
      createConversation: jest.fn(),
      markAsRead: jest.fn(),
      deleteConversation: jest.fn(),
      loadMessages: jest.fn(),
      getConversation: jest.fn(),
      getUnreadCount: jest.fn(),
      getTotalUnreadCount: jest.fn(),
    })

    render(<MessagingSystem userId="user_123" />)
    
    expect(screen.getByText('No conversations yet')).toBeInTheDocument()
  })

  it('searches conversations by participant name', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const searchInput = screen.getByPlaceholderText('Search conversations...')
    fireEvent.change(searchInput, { target: { value: 'John' } })
    
    expect(screen.getByText('Chat with John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Chat with Jane Smith')).not.toBeInTheDocument()
  })

  it('searches conversations by message content', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const searchInput = screen.getByPlaceholderText('Search conversations...')
    fireEvent.change(searchInput, { target: { value: 'interested' } })
    
    expect(screen.getByText('Chat with John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Chat with Jane Smith')).not.toBeInTheDocument()
  })

  it('shows unread count for conversations', () => {
    render(<MessagingSystem userId="user_123" />)
    
    expect(screen.getByText('1')).toBeInTheDocument() // Unread count for conv_1
  })

  it('selects conversation when clicked', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  it('marks conversation as read when selected', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    expect(mockMarkAsRead).toHaveBeenCalledWith('conv_1')
  })

  it('displays messages in selected conversation', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    expect(screen.getByText('Hi! I\'m interested in your property.')).toBeInTheDocument()
    expect(screen.getByText('Hello! Yes, I\'d be happy to help.')).toBeInTheDocument()
  })

  it('shows no messages message when conversation has no messages', () => {
    mockUseMessaging.mockReturnValue({
      conversations: mockConversations,
      activeConversation: null,
      messages: {},
      isLoading: false,
      error: null,
      sendMessage: jest.fn(),
      createConversation: jest.fn(),
      markAsRead: jest.fn(),
      deleteConversation: jest.fn(),
      loadMessages: jest.fn(),
      getConversation: jest.fn(),
      getUnreadCount: jest.fn(),
      getTotalUnreadCount: jest.fn(),
    })

    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    expect(screen.getByText('Start a conversation')).toBeInTheDocument()
  })

  it('sends message when send button is clicked', async () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    const messageInput = screen.getByPlaceholderText('Type a message...')
    fireEvent.change(messageInput, { target: { value: 'Hello there!' } })
    
    const sendButton = screen.getByText('Send')
    fireEvent.click(sendButton)
    
    expect(mockSendMessage).toHaveBeenCalledWith({
      conversationId: 'conv_1',
      senderId: 'user_123',
      content: 'Hello there!',
      type: 'text',
      isRead: false,
    })
  })

  it('sends message when enter key is pressed', async () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    const messageInput = screen.getByPlaceholderText('Type a message...')
    fireEvent.change(messageInput, { target: { value: 'Hello there!' } })
    fireEvent.keyPress(messageInput, { key: 'Enter' })
    
    expect(mockSendMessage).toHaveBeenCalledWith({
      conversationId: 'conv_1',
      senderId: 'user_123',
      content: 'Hello there!',
      type: 'text',
      isRead: false,
    })
  })

  it('does not send empty messages', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    const sendButton = screen.getByText('Send')
    expect(sendButton).toBeDisabled()
  })

  it('disables send button for empty message', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    const messageInput = screen.getByPlaceholderText('Type a message...')
    fireEvent.change(messageInput, { target: { value: '   ' } })
    
    const sendButton = screen.getByText('Send')
    expect(sendButton).toBeDisabled()
  })

  it('shows participant online status', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  it('shows participant offline status', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with Jane Smith')
    fireEvent.click(conversation)
    
    expect(screen.getByText('Offline')).toBeInTheDocument()
  })

  it('deletes conversation when delete button is clicked', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    const deleteButton = screen.getByText('Delete Chat')
    fireEvent.click(deleteButton)
    
    expect(mockDeleteConversation).toHaveBeenCalledWith('conv_1')
  })

  it('shows select conversation message when no conversation is selected', () => {
    render(<MessagingSystem userId="user_123" />)
    
    expect(screen.getByText('Select a conversation')).toBeInTheDocument()
    expect(screen.getByText('Choose a conversation from the sidebar to start messaging')).toBeInTheDocument()
  })

  it('displays message timestamps', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    // Should show formatted timestamps
    const timestamps = screen.getAllByText(/\d{1,2}:\d{2}/)
    expect(timestamps.length).toBeGreaterThan(0)
  })

  it('shows message bubbles with correct styling for own messages', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    const ownMessage = screen.getByText('Hello! Yes, I\'d be happy to help.')
    const messageBubble = ownMessage.closest('div')
    
    expect(messageBubble).toHaveClass('bg-blue-600', 'text-white')
  })

  it('shows message bubbles with correct styling for other messages', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    const otherMessage = screen.getByText('Hi! I\'m interested in your property.')
    const messageBubble = otherMessage.closest('div')
    
    expect(messageBubble).toHaveClass('bg-gray-200', 'text-gray-900')
  })

  it('formats message time correctly for recent messages', () => {
    render(<MessagingSystem userId="user_123" />)
    
    const conversation = screen.getByText('Chat with John Doe')
    fireEvent.click(conversation)
    
    // Should show time format for recent messages
    const timeElements = screen.getAllByText(/\d{1,2}:\d{2}/)
    expect(timeElements.length).toBeGreaterThan(0)
  })

  it('shows conversation last message preview', () => {
    render(<MessagingSystem userId="user_123" />)
    
    expect(screen.getByText('Hi! I\'m interested in your property.')).toBeInTheDocument()
    expect(screen.getByText('Thank you for your interest!')).toBeInTheDocument()
  })

  it('shows no messages yet when conversation has no last message', () => {
    const conversationsWithoutLastMessage = [
      {
        ...mockConversations[0],
        lastMessage: undefined,
      },
    ]

    mockUseMessaging.mockReturnValue({
      conversations: conversationsWithoutLastMessage,
      activeConversation: null,
      messages: {},
      isLoading: false,
      error: null,
      sendMessage: jest.fn(),
      createConversation: jest.fn(),
      markAsRead: jest.fn(),
      deleteConversation: jest.fn(),
      loadMessages: jest.fn(),
      getConversation: jest.fn(),
      getUnreadCount: jest.fn(),
      getTotalUnreadCount: jest.fn(),
    })

    render(<MessagingSystem userId="user_123" />)
    
    expect(screen.getByText('No messages yet')).toBeInTheDocument()
  })
})
