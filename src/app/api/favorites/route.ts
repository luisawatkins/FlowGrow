import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Mock database for favorites
const favorites = new Map<string, Set<string>>();

// Mock property database
const properties = new Map([
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const userFavorites = favorites.get(userId) || new Set();

    // Get full property details for each favorite
    const favoriteProperties = Array.from(userFavorites)
      .map(propertyId => properties.get(propertyId))
      .filter(Boolean);

    return NextResponse.json({ favorites: favoriteProperties });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}