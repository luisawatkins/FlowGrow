import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock agent data (replace with actual database integration)
const mockAgents = new Map([
  ['1', {
    id: '1',
    name: 'John Smith',
    role: 'Senior Agent',
    avatarUrl: '/images/agents/john-smith.jpg',
    isOnline: true,
    properties: ['1', '2', '3'],
    specialties: ['Luxury Homes', 'Waterfront Properties'],
    languages: ['English', 'Spanish'],
    experience: 8,
    ratings: {
      average: 4.8,
      count: 156,
    },
  }],
  ['2', {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Property Specialist',
    avatarUrl: '/images/agents/sarah-johnson.jpg',
    isOnline: false,
    lastSeen: '2024-01-01T12:00:00Z',
    properties: ['4', '5', '6'],
    specialties: ['First-time Buyers', 'Investment Properties'],
    languages: ['English', 'French'],
    experience: 5,
    ratings: {
      average: 4.6,
      count: 98,
    },
  }],
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const agent = mockAgents.get(params.id);
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}
