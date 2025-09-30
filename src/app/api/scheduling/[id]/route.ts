import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Reference to mock data from parent route
declare const mockAppointments: Map<string, any[]>;
declare const MOCK_USER_ID: string;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { date, time } = await request.json();
    const userAppointments = mockAppointments.get(MOCK_USER_ID) || [];
    
    const appointmentIndex = userAppointments.findIndex(
      appt => appt.id === params.id
    );

    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Update appointment
    const updatedAppointment = {
      ...userAppointments[appointmentIndex],
      date,
      time,
      updatedAt: new Date().toISOString(),
    };

    userAppointments[appointmentIndex] = updatedAppointment;
    mockAppointments.set(MOCK_USER_ID, userAppointments);

    // In a real application:
    // 1. Update calendar events
    // 2. Send notifications
    // 3. Update reminders

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userAppointments = mockAppointments.get(MOCK_USER_ID) || [];
    
    const appointmentIndex = userAppointments.findIndex(
      appt => appt.id === params.id
    );

    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Remove appointment
    userAppointments.splice(appointmentIndex, 1);
    mockAppointments.set(MOCK_USER_ID, userAppointments);

    // In a real application:
    // 1. Remove calendar events
    // 2. Send cancellation notifications
    // 3. Update agent availability
    // 4. Handle cancellation policies

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error canceling appointment:', error);
    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
}
