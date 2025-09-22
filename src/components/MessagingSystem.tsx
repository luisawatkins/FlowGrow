'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Message, Conversation, MessageType } from '@/types'
import { useMessaging } from '@/hooks/useMessaging'

interface MessagingSystemProps {
  userId: string
  className?: string
}

export function MessagingSystem({ userId, className = '' }: MessagingSystemProps) {
  const {
    conversations,
    activeConversation,
    messages,
    isLoading,
    sendMessage,
    createConversation,
    markAsRead,
    deleteConversation,
  } = useMessaging(userId)

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p.id !== userId)
    return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const currentConversation = conversations.find(conv => conv.id === selectedConversationId)
  const currentMessages = selectedConversationId ? messages[selectedConversationId] || [] : []

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return

    const message: Omit<Message, 'id' | 'createdAt'> = {
      conversationId: selectedConversationId,
      senderId: userId,
      content: newMessage.trim(),
      type: 'text',
      isRead: false,
    }

    await sendMessage(message)
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleStartConversation = async (participantId: string, participantName: string) => {
    const conversation = await createConversation([userId, participantId], `Chat with ${participantName}`)
    setSelectedConversationId(conversation.id)
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-[600px] ${className}`}>
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Messages</h3>
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="text-4xl mb-2">💬</div>
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => {
                const otherParticipant = conversation.participants.find(p => p.id !== userId)
                const unreadCount = conversation.unreadCount || 0
                
                return (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                      selectedConversationId === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedConversationId(conversation.id)
                      if (unreadCount > 0) {
                        markAsRead(conversation.id)
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {otherParticipant?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">
                            {otherParticipant?.name || 'Unknown User'}
                          </h4>
                          {unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                        {conversation.lastMessage && (
                          <p className="text-xs text-gray-400">
                            {formatMessageTime(conversation.lastMessage.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId && currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {currentConversation.participants.find(p => p.id !== userId)?.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {currentConversation.participants.find(p => p.id !== userId)?.name || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {currentConversation.participants.find(p => p.id !== userId)?.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteConversation(selectedConversationId)}
                >
                  Delete Chat
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">💬</div>
                  <p>Start a conversation</p>
                </div>
              ) : (
                currentMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === userId}
                    formatTime={formatMessageTime}
                  />
                ))
              )}
              {isTyping && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">Typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="self-end"
                >
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  formatTime: (timestamp: string) => string
}

function MessageBubble({ message, isOwn, formatTime }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${
          isOwn ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  )
}
