import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock favorites data (replace with actual database integration)
let mockFavorites = new Map<string, Set<string>>();

// Mock property data
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

// Mock user ID (replace with actual auth)
const MOCK_USER_ID = 'user1';

export async function GET() {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const userFavorites = mockFavorites.get(MOCK_USER_ID) || new Set();
    const favoriteIds = Array.from(userFavorites);
    
    // Fetch property details for favorites
    const properties = favoriteIds
      .map(id => mockProperties.get(id))
      .filter(Boolean);

    return NextResponse.json({
      favoriteIds,
      properties,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
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

    // Get or initialize user's favorites
    let userFavorites = mockFavorites.get(MOCK_USER_ID);
    if (!userFavorites) {
      userFavorites = new Set();
      mockFavorites.set(MOCK_USER_ID, userFavorites);
    }

    // Toggle favorite status
    if (userFavorites.has(propertyId)) {
      userFavorites.delete(propertyId);
    } else {
      userFavorites.add(propertyId);
    }

    const favoriteIds = Array.from(userFavorites);
    const properties = favoriteIds
      .map(id => mockProperties.get(id))
      .filter(Boolean);

    return NextResponse.json({
      favoriteIds,
      properties,
    });
  } catch (error) {
    console.error('Error updating favorites:', error);
    return NextResponse.json(
      { error: 'Failed to update favorites' },
      { status: 500 }
    );
  }
}
