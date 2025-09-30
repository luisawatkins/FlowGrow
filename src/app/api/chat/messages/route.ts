import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  content: string;
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
  isRead: boolean;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  participants: {
    id: string;
    name: string;
    image?: string;
    role: 'user' | 'agent';
  }[];
  propertyId?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Mock database for chat
const conversations = new Map<string, ChatConversation>();
const messages = new Map<string, ChatMessage[]>();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const conversation = conversations.get(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Check if user is a participant
    const userId = (session.user as any).id;
    if (!conversation.participants.some((p) => p.id === userId)) {
      return NextResponse.json(
        { error: 'Not authorized to view this conversation' },
        { status: 403 }
      );
    }

    let conversationMessages = messages.get(conversationId) || [];

    // Apply pagination
    if (before) {
      const beforeDate = new Date(before);
      conversationMessages = conversationMessages.filter(
        (m) => new Date(m.createdAt) < beforeDate
      );
    }

    // Sort by date and limit
    conversationMessages = conversationMessages
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);

    return NextResponse.json({
      messages: conversationMessages,
      conversation,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { conversationId, content, attachments } = await request.json();

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'Conversation ID and content are required' },
        { status: 400 }
      );
    }

    const conversation = conversations.get(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Check if user is a participant
    const userId = (session.user as any).id;
    if (!conversation.participants.some((p) => p.id === userId)) {
      return NextResponse.json(
        { error: 'Not authorized to send messages in this conversation' },
        { status: 403 }
      );
    }

    const message: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      conversationId,
      senderId: userId,
      senderName: session.user.name || 'Anonymous',
      senderImage: session.user.image,
      content,
      attachments,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    // Add message to conversation
    const conversationMessages = messages.get(conversationId) || [];
    conversationMessages.push(message);
    messages.set(conversationId, conversationMessages);

    // Update conversation
    conversation.lastMessage = message;
    conversation.updatedAt = message.createdAt;
    conversation.unreadCount += 1;
    conversations.set(conversationId, conversation);

    // In a real application, you would:
    // 1. Save to database
    // 2. Emit WebSocket event
    // 3. Send push notification
    // 4. Update unread counts

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}