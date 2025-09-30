import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock property data (replace with actual database integration)
const mockProperties = new Map([
  ['1', {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 450000,
  }],
  ['2', {
    id: '2',
    title: 'Suburban Family Home',
    price: 750000,
  }],
]);

// Mock price alerts storage (replace with actual database integration)
const mockPriceAlerts = new Map<string, any[]>();

// Mock user ID (replace with actual auth)
const MOCK_USER_ID = 'user1';

export async function GET() {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const userAlerts = mockPriceAlerts.get(MOCK_USER_ID) || [];
    
    // Add property details to each alert
    const alertsWithProperties = userAlerts.map(alert => ({
      ...alert,
      property: mockProperties.get(alert.propertyId),
    }));

    // Sort by creation date (newest first)
    const sortedAlerts = alertsWithProperties.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(sortedAlerts);
  } catch (error) {
    console.error('Error fetching price alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      propertyId,
      type,
      currentPrice,
      targetPrice,
      percentage,
    } = await request.json();

    if (!propertyId || !type || !currentPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const property = mockProperties.get(propertyId);
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Create new alert
    const newAlert = {
      id: Date.now().toString(),
      propertyId,
      type,
      currentPrice,
      targetPrice,
      percentage,
      createdAt: new Date().toISOString(),
    };

    // Get or initialize user's alerts
    let userAlerts = mockPriceAlerts.get(MOCK_USER_ID) || [];
    
    // Add new alert
    userAlerts = [...userAlerts, newAlert];
    mockPriceAlerts.set(MOCK_USER_ID, userAlerts);

    // Return with property details
    return NextResponse.json({
      ...newAlert,
      property,
    });
  } catch (error) {
    console.error('Error creating price alert:', error);
    return NextResponse.json(
      { error: 'Failed to create price alert' },
      { status: 500 }
    );
  }
}