import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export interface ViewingSlot {
  id: string;
  propertyId: string;
  agentId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface ViewingBooking {
  id: string;
  slotId: string;
  propertyId: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Mock database for available slots and bookings
const availableSlots = new Map<string, ViewingSlot[]>();
const bookings = new Map<string, ViewingBooking>();

// Helper function to generate available slots for a property
function generateAvailableSlots(propertyId: string, agentId: string): ViewingSlot[] {
  const slots: ViewingSlot[] = [];
  const today = new Date();
  
  // Generate slots for the next 7 days
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Generate slots from 9 AM to 5 PM
    for (let hour = 9; hour < 17; hour++) {
      const startTime = new Date(date);
      startTime.setHours(hour, 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(hour + 1, 0, 0, 0);
      
      slots.push({
        id: `${propertyId}-${startTime.toISOString()}`,
        propertyId,
        agentId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        isBooked: false,
      });
    }
  }
  
  return slots;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const date = searchParams.get('date');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    let slots = availableSlots.get(propertyId);
    if (!slots) {
      // Generate slots if none exist
      slots = generateAvailableSlots(propertyId, 'agent-1');
      availableSlots.set(propertyId, slots);
    }

    // Filter slots by date if provided
    if (date) {
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);

      slots = slots.filter(
        (slot) =>
          new Date(slot.startTime) >= dateStart &&
          new Date(slot.startTime) <= dateEnd
      );
    }

    // Filter out past slots
    const now = new Date();
    slots = slots.filter((slot) => new Date(slot.startTime) > now);

    return NextResponse.json({ slots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
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

    const { slotId, propertyId, name, email, phone, notes } = await request.json();

    // Validate required fields
    if (!slotId || !propertyId || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slot exists and is available
    const slots = availableSlots.get(propertyId);
    const slot = slots?.find((s) => s.id === slotId);

    if (!slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    if (slot.isBooked) {
      return NextResponse.json(
        { error: 'Slot is already booked' },
        { status: 400 }
      );
    }

    // Create booking
    const booking: ViewingBooking = {
      id: Math.random().toString(36).substr(2, 9),
      slotId,
      propertyId,
      userId: (session.user as any).id,
      name,
      email,
      phone,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update slot status
    slot.isBooked = true;
    bookings.set(booking.id, booking);

    // In a real application, you would:
    // 1. Send confirmation email to user
    // 2. Send notification to agent
    // 3. Add to calendar system
    // 4. Create notification in the system

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error booking viewing slot:', error);
    return NextResponse.json(
      { error: 'Failed to book viewing slot' },
      { status: 500 }
    );
  }
}
