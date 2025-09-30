import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock available slots (replace with actual database/calendar integration)
const mockAvailableSlots = new Map([
  ['agent1', [
    // Today
    ...Array.from({ length: 5 }, (_, i) => ({
      date: new Date().toISOString().split('T')[0],
      time: `${10 + i}:00`,
      available: Math.random() > 0.3,
    })),
    // Tomorrow
    ...Array.from({ length: 5 }, (_, i) => ({
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: `${10 + i}:00`,
      available: Math.random() > 0.3,
    })),
    // Day after tomorrow
    ...Array.from({ length: 5 }, (_, i) => ({
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      time: `${10 + i}:00`,
      available: Math.random() > 0.3,
    })),
  ]],
]);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId');
    const agentId = searchParams.get('agentId');

    if (!propertyId || !agentId) {
      return NextResponse.json(
        { error: 'Property ID and agent ID are required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Check agent's calendar availability
    // 2. Consider property availability
    // 3. Handle time zones
    // 4. Apply booking buffer times
    // 5. Check for holidays and off-hours
    // 6. Consider agent preferences and working hours

    // Get mock slots for the agent
    const slots = mockAvailableSlots.get(agentId) || [];

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}
