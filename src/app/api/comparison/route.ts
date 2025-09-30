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
    yearBuilt: 2020,
    parking: '1 Covered Space',
    features: [
      'Modern Kitchen',
      'Hardwood Floors',
      'Large Windows',
      'Central AC',
    ],
    amenities: [
      'Gym',
      'Pool',
      'Package Room',
      '24/7 Security',
    ],
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
    yearBuilt: 2015,
    parking: '2 Car Garage',
    features: [
      'Open Floor Plan',
      'Fireplace',
      'Master Suite',
      'Walk-in Closets',
    ],
    amenities: [
      'Large Backyard',
      'Patio',
      'Smart Home System',
      'Security System',
    ],
  }],
]);

// Mock comparison list storage (replace with actual database/cache)
const mockComparisonLists = new Map<string, Set<string>>();

// Mock user ID (replace with actual auth)
const MOCK_USER_ID = 'user1';

export async function GET() {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const userComparison = mockComparisonLists.get(MOCK_USER_ID) || new Set();
    
    // Get full property details
    const properties = Array.from(userComparison)
      .map(id => mockProperties.get(id))
      .filter(Boolean);

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching comparison list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comparison list' },
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

    // Get or initialize user's comparison list
    let userComparison = mockComparisonLists.get(MOCK_USER_ID);
    if (!userComparison) {
      userComparison = new Set();
      mockComparisonLists.set(MOCK_USER_ID, userComparison);
    }

    // Check if maximum properties reached
    if (userComparison.size >= 4) {
      return NextResponse.json(
        { error: 'Maximum number of properties in comparison reached' },
        { status: 400 }
      );
    }

    // Add to comparison
    userComparison.add(propertyId);

    // Return updated list with full property details
    const properties = Array.from(userComparison)
      .map(id => mockProperties.get(id))
      .filter(Boolean);

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error adding to comparison:', error);
    return NextResponse.json(
      { error: 'Failed to add to comparison' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Clear user's comparison list
    mockComparisonLists.delete(MOCK_USER_ID);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing comparison:', error);
    return NextResponse.json(
      { error: 'Failed to clear comparison' },
      { status: 500 }
    );
  }
}