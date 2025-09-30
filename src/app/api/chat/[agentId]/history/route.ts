import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock chat history (replace with actual database integration)
const mockChatHistory = new Map([
  ['1', [
    {
      id: '1',
      senderId: '1',
      senderType: 'agent',
      content: 'Hello! How can I help you today?',
      timestamp: '2024-01-01T10:00:00Z',
      status: 'read',
    },
    {
      id: '2',
      senderId: 'user1',
      senderType: 'user',
      content: 'Hi, I\'m interested in the downtown apartment.',
      timestamp: '2024-01-01T10:01:00Z',
      status: 'read',
    },
    {
      id: '3',
      senderId: '1',
      senderType: 'agent',
      content: 'Great choice! Would you like to schedule a viewing?',
      timestamp: '2024-01-01T10:02:00Z',
      status: 'read',
      attachments: [
        {
          id: '1',
          type: 'image',
          url: '/images/properties/apartment1.jpg',
          name: 'Apartment View',
        },
      ],
    },
  ]],
]);

// Mock user ID (replace with actual auth)
const MOCK_USER_ID = 'user1';

export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const chatHistory = mockChatHistory.get(params.agentId) || [];

    return NextResponse.json(chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}
