'use client'

import { useState, useEffect, useCallback } from 'react'
import { Message, Conversation, MessageType } from '@/types'

interface MessagingState {
  conversations: Conversation[]
  activeConversation: Conversation | null
  messages: Record<string, Message[]>
  isLoading: boolean
  error: string | null
}

interface Participant {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
}

export function useMessaging(userId?: string) {
  const [state, setState] = useState<MessagingState>({
    conversations: [],
    activeConversation: null,
    messages: {},
    isLoading: true,
    error: null,
  })

  // Load conversations
  const loadConversations = useCallback(async (userId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // In a real app, this would fetch from your backend
      const mockConversations: Conversation[] = [
        {
          id: 'conv_1',
          participants: [
            { id: userId, name: 'You', isOnline: true },
            { id: 'user_2', name: 'John Doe', isOnline: true },
          ],
          title: 'Chat with John Doe',
          lastMessage: {
            id: 'msg_1',
            conversationId: 'conv_1',
            senderId: 'user_2',
            content: 'Hi! I\'m interested in your property. Can we schedule a viewing?',
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
          participants: [
            { id: userId, name: 'You', isOnline: true },
            { id: 'user_3', name: 'Jane Smith', isOnline: false },
          ],
          title: 'Chat with Jane Smith',
          lastMessage: {
            id: 'msg_2',
            conversationId: 'conv_2',
            senderId: userId,
            content: 'Thank you for your interest! I\'ll send you more details soon.',
            type: 'text',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          },
          unreadCount: 0,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ]

      setState(prev => ({
        ...prev,
        conversations: mockConversations,
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load conversations',
        isLoading: false,
      }))
    }
  }, [])

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      // In a real app, this would fetch from your backend
      const mockMessages: Message[] = [
        {
          id: 'msg_1',
          conversationId,
          senderId: 'user_2',
          content: 'Hi! I\'m interested in your property. Can we schedule a viewing?',
          type: 'text',
          isRead: false,
          createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        },
        {
          id: 'msg_2',
          conversationId,
          senderId: userId!,
          content: 'Hello! Yes, I\'d be happy to schedule a viewing. When would work best for you?',
          type: 'text',
          isRead: true,
          createdAt: new Date(Date.now() - 1200000).toISOString(), // 20 minutes ago
        },
        {
          id: 'msg_3',
          conversationId,
          senderId: 'user_2',
          content: 'How about this Saturday at 2 PM?',
          type: 'text',
          isRead: false,
          createdAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        },
      ]

      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [conversationId]: mockMessages,
        },
      }))
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }, [userId])

  // Send message
  const sendMessage = useCallback(async (messageData: Omit<Message, 'id' | 'createdAt'>) => {
    try {
      const message: Message = {
        ...messageData,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      }

      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [message.conversationId]: [
            ...(prev.messages[message.conversationId] || []),
            message,
          ],
        },
        conversations: prev.conversations.map(conv =>
          conv.id === message.conversationId
            ? {
                ...conv,
                lastMessage: message,
                updatedAt: message.createdAt,
              }
            : conv
        ),
      }))

      // In a real app, this would send to the backend/WebSocket
      return message
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }, [])

  // Create new conversation
  const createConversation = useCallback(async (participantIds: string[], title: string) => {
    try {
      const conversation: Conversation = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        participants: participantIds.map(id => ({
          id,
          name: id === userId ? 'You' : `User ${id.slice(-4)}`,
          isOnline: Math.random() > 0.5, // Mock online status
        })),
        title,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setState(prev => ({
        ...prev,
        conversations: [conversation, ...prev.conversations],
        activeConversation: conversation,
      }))

      // In a real app, this would create in the backend
      return conversation
    } catch (error) {
      console.error('Failed to create conversation:', error)
      throw error
    }
  }, [userId])

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      setState(prev => ({
        ...prev,
        conversations: prev.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        ),
        messages: {
          ...prev.messages,
          [conversationId]: (prev.messages[conversationId] || []).map(msg => ({
            ...msg,
            isRead: true,
          })),
        },
      }))

      // In a real app, this would update the backend
    } catch (error) {
      console.error('Failed to mark conversation as read:', error)
    }
  }, [])

  // Delete conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      setState(prev => ({
        ...prev,
        conversations: prev.conversations.filter(conv => conv.id !== conversationId),
        messages: Object.fromEntries(
          Object.entries(prev.messages).filter(([id]) => id !== conversationId)
        ),
        activeConversation: prev.activeConversation?.id === conversationId ? null : prev.activeConversation,
      }))

      // In a real app, this would delete from the backend
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }, [])

  // Get conversation by ID
  const getConversation = useCallback((conversationId: string) => {
    return state.conversations.find(conv => conv.id === conversationId)
  }, [state.conversations])

  // Get unread count for a conversation
  const getUnreadCount = useCallback((conversationId: string) => {
    const conversation = state.conversations.find(conv => conv.id === conversationId)
    return conversation?.unreadCount || 0
  }, [state.conversations])

  // Get total unread count
  const getTotalUnreadCount = useCallback(() => {
    return state.conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0)
  }, [state.conversations])

  // Initialize when userId changes
  useEffect(() => {
    if (userId) {
      loadConversations(userId)
    }
  }, [userId, loadConversations])

  return {
    ...state,
    sendMessage,
    createConversation,
    markAsRead,
    deleteConversation,
    loadMessages,
    getConversation,
    getUnreadCount,
    getTotalUnreadCount,
  }
}
