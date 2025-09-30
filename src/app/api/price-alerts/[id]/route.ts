import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Reference to mock data from parent route
declare const mockProperties: Map<string, any>;
declare const mockPriceAlerts: Map<string, any[]>;
declare const MOCK_USER_ID: string;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const userAlerts = mockPriceAlerts.get(MOCK_USER_ID) || [];
    
    const alertIndex = userAlerts.findIndex(
      alert => alert.id === params.id
    );

    if (alertIndex === -1) {
      return NextResponse.json(
        { error: 'Price alert not found' },
        { status: 404 }
      );
    }

    // Update alert
    const updatedAlert = {
      ...userAlerts[alertIndex],
      ...updates,
    };

    userAlerts[alertIndex] = updatedAlert;
    mockPriceAlerts.set(MOCK_USER_ID, userAlerts);

    // Return with property details
    return NextResponse.json({
      ...updatedAlert,
      property: mockProperties.get(updatedAlert.propertyId),
    });
  } catch (error) {
    console.error('Error updating price alert:', error);
    return NextResponse.json(
      { error: 'Failed to update price alert' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userAlerts = mockPriceAlerts.get(MOCK_USER_ID) || [];
    
    const alertIndex = userAlerts.findIndex(
      alert => alert.id === params.id
    );

    if (alertIndex === -1) {
      return NextResponse.json(
        { error: 'Price alert not found' },
        { status: 404 }
      );
    }

    // Remove alert
    userAlerts.splice(alertIndex, 1);
    mockPriceAlerts.set(MOCK_USER_ID, userAlerts);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting price alert:', error);
    return NextResponse.json(
      { error: 'Failed to delete price alert' },
      { status: 500 }
    );
  }
}