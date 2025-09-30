import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock property data (replace with actual database integration)
const mockProperties = new Map([
  ['1', {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 450000,
    imageUrl: '/images/properties/apartment1.jpg',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    propertyType: 'Apartment',
    location: 'Downtown',
  }],
  ['2', {
    id: '2',
    title: 'Suburban Family Home',
    price: 750000,
    imageUrl: '/images/properties/house1.jpg',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2500,
    propertyType: 'House',
    location: 'Suburbs',
  }],
]);

// Mock recent views storage (replace with actual database/cache)
const mockRecentViews = new Map<string, { propertyId: string; viewedAt: string }[]>();

// Mock user ID (replace with actual auth)
const MOCK_USER_ID = 'user1';

export async function GET() {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const userViews = mockRecentViews.get(MOCK_USER_ID) || [];
    
    // Get full property details and add viewedAt timestamp
    const recentProperties = userViews
      .map(view => {
        const property = mockProperties.get(view.propertyId);
        return property ? {
          ...property,
          viewedAt: view.viewedAt,
        } : null;
      })
      .filter(Boolean);

    return NextResponse.json(recentProperties);
  } catch (error) {
    console.error('Error fetching recent views:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent views' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
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

    // Get or initialize user's recent views
    let userViews = mockRecentViews.get(MOCK_USER_ID) || [];
    
    // Remove if already exists
    userViews = userViews.filter(view => view.propertyId !== propertyId);
    
    // Add to front of list
    userViews.unshift({
      propertyId,
      viewedAt: new Date().toISOString(),
    });
    
    // Keep only last 20 views
    userViews = userViews.slice(0, 20);
    
    mockRecentViews.set(MOCK_USER_ID, userViews);

    // Return updated list with full property details
    const recentProperties = userViews
      .map(view => {
        const prop = mockProperties.get(view.propertyId);
        return prop ? {
          ...prop,
          viewedAt: view.viewedAt,
        } : null;
      })
      .filter(Boolean);

    return NextResponse.json(recentProperties);
  } catch (error) {
    console.error('Error adding to recent views:', error);
    return NextResponse.json(
      { error: 'Failed to add to recent views' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Clear user's recent views
    mockRecentViews.delete(MOCK_USER_ID);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing recent views:', error);
    return NextResponse.json(
      { error: 'Failed to clear recent views' },
      { status: 500 }
    );
  }
}
