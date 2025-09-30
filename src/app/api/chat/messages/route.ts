import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Reference to mock data from other routes
declare const mockChatHistory: Map<string, any[]>;
declare const MOCK_USER_ID: string;

export async function POST(request: NextRequest) {
  try {
    const {
      agentId,
      content,
      propertyId,
    } = await request.json();

    if (!agentId || !content) {
      return NextResponse.json(
        { error: 'Agent ID and content are required' },
        { status: 400 }
      );
    }

    // Create new message
    const newMessage = {
      id: Date.now().toString(),
      senderId: MOCK_USER_ID,
      senderType: 'user',
      content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      propertyId,
    };

    // Get or initialize chat history
    let chatHistory = mockChatHistory.get(agentId) || [];
    
    // Add new message
    chatHistory = [...chatHistory, newMessage];
    mockChatHistory.set(agentId, chatHistory);

    // In a real application, you would:
    // 1. Save the message to the database
    // 2. Notify the agent via WebSocket
    // 3. Handle message delivery status
    // 4. Process any commands or triggers
    // 5. Generate automated responses

    // Simulate agent typing and response
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        senderId: agentId,
        senderType: 'agent',
        content: 'Thank you for your message. I\'ll get back to you shortly.',
        timestamp: new Date().toISOString(),
        status: 'sent',
      };

      chatHistory.push(response);
      mockChatHistory.set(agentId, chatHistory);
    }, 2000);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
