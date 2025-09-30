import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: {
    priceRange?: {
      min: number;
      max: number;
    };
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    location?: string;
    squareFeet?: {
      min: number;
      max: number;
    };
  };
  emailAlerts: boolean;
  alertFrequency: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  lastRunAt: string;
}

// Mock database for saved searches
const savedSearches = new Map<string, SavedSearch[]>();

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
    const userSearches = savedSearches.get(userId) || [];

    return NextResponse.json({ savedSearches: userSearches });
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved searches' },
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

    const userId = (session.user as any).id;
    const { name, filters, emailAlerts, alertFrequency } = await request.json();

    // Validate required fields
    if (!name || !filters) {
      return NextResponse.json(
        { error: 'Name and filters are required' },
        { status: 400 }
      );
    }

    const newSearch: SavedSearch = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      name,
      filters,
      emailAlerts: emailAlerts || false,
      alertFrequency: alertFrequency || 'weekly',
      createdAt: new Date().toISOString(),
      lastRunAt: new Date().toISOString(),
    };

    const userSearches = savedSearches.get(userId) || [];
    userSearches.push(newSearch);
    savedSearches.set(userId, userSearches);

    // In a real application, you would:
    // 1. Save to database
    // 2. Set up email alert schedule if enabled
    // 3. Create initial property matches baseline

    return NextResponse.json(newSearch);
  } catch (error) {
    console.error('Error creating saved search:', error);
    return NextResponse.json(
      { error: 'Failed to create saved search' },
      { status: 500 }
    );
  }
}