import { useState, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface Agent {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderType: 'user' | 'agent';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: Array<{
    id: string;
    type: 'image' | 'document';
    url: string;
    name: string;
  }>;
}

interface SendMessageParams {
  content: string;
  propertyId?: string;
}

export function useChat(agentId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    // In a real application, you would:
    // 1. Connect to your WebSocket server
    // 2. Authenticate the connection
    // 3. Join the chat room
    // 4. Handle reconnection
    
    const fetchInitialData = async () => {
      try {
        // Fetch agent details
        const agentResponse = await fetch(`/api/agents/${agentId}`);
        if (!agentResponse.ok) throw new Error('Failed to fetch agent details');
        const agentData = await agentResponse.json();
        setAgent(agentData);

        // Fetch chat history
        const historyResponse = await fetch(`/api/chat/${agentId}/history`);
        if (!historyResponse.ok) throw new Error('Failed to fetch chat history');
        const historyData = await historyResponse.json();
        setMessages(historyData);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Mock socket connection
    const mockSocket = {
      on: (event: string, callback: Function) => {
        // Mock socket event listeners
      },
      emit: (event: string, data: any) => {
        // Mock socket event emitters
      },
      disconnect: () => {
        // Mock socket disconnection
      },
    };

    setSocket(mockSocket as any);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [agentId]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('typing', (isTyping: boolean) => {
      setIsTyping(isTyping);
    });

    socket.on('message_status', ({ messageId, status }: { messageId: string; status: string }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status } : msg
        )
      );
    });

    socket.on('agent_status', ({ isOnline, lastSeen }: { isOnline: boolean; lastSeen?: string }) => {
      setAgent(prev =>
        prev ? { ...prev, isOnline, lastSeen } : null
      );
    });

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('message_status');
      socket.off('agent_status');
    };
  }, [socket]);

  const sendMessage = async (params: SendMessageParams) => {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const message = await response.json();
      setMessages(prev => [...prev, message]);

      // Emit message via socket
      if (socket) {
        socket.emit('message', message);
      }

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const uploadAttachment = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('agentId', agentId);

      const response = await fetch('/api/chat/attachments', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload attachment');
      }

      const attachment = await response.json();
      return attachment;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  };

  return {
    messages,
    agent,
    isLoading,
    isTyping,
    sendMessage,
    uploadAttachment,
  };
}
