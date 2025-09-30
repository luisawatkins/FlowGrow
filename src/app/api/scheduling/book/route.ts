import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock appointments storage (replace with actual database integration)
const mockAppointments = new Map<string, any[]>();

// Mock user ID (replace with actual auth)
const MOCK_USER_ID = 'user1';

export async function POST(request: NextRequest) {
  try {
    const {
      propertyId,
      agentId,
      date,
      time,
      name,
      email,
      phone,
      notes,
    } = await request.json();

    // Validate required fields
    if (!propertyId || !agentId || !date || !time || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Verify slot availability
    // 2. Check for double bookings
    // 3. Create calendar events
    // 4. Send notifications
    // 5. Handle time zones
    // 6. Create reminders
    // 7. Update agent's calendar

    // Create new appointment
    const appointment = {
      id: Date.now().toString(),
      propertyId,
      agentId,
      userId: MOCK_USER_ID,
      date,
      time,
      name,
      email,
      phone,
      notes,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Store appointment
    let userAppointments = mockAppointments.get(MOCK_USER_ID) || [];
    userAppointments = [...userAppointments, appointment];
    mockAppointments.set(MOCK_USER_ID, userAppointments);

    // In a real application, send confirmation emails
    // await sendConfirmationEmails(appointment);

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    );
  }
}
