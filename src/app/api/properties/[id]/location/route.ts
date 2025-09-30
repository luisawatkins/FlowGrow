import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock property location data (replace with actual database integration)
const mockLocations = new Map([
  ['1', {
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
    address: '123 Main St, New York, NY 10001',
    formattedAddress: '123 Main Street, New York, NY 10001, United States',
  }],
  ['2', {
    coordinates: {
      latitude: 34.0522,
      longitude: -118.2437,
    },
    address: '456 Oak Ave, Los Angeles, CA 90012',
    formattedAddress: '456 Oak Avenue, Los Angeles, CA 90012, United States',
  }],
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const location = mockLocations.get(params.id);
    
    if (!location) {
      return NextResponse.json(
        { error: 'Property location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(location);
  } catch (error) {
    console.error('Error fetching property location:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property location' },
      { status: 500 }
    );
  }
}
