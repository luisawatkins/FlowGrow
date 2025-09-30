import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock saved searches storage (replace with actual database integration)
const mockSavedSearches = new Map<string, any[]>();

// Mock user ID (replace with actual auth)
const MOCK_USER_ID = 'user1';

export async function GET() {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const userSearches = mockSavedSearches.get(MOCK_USER_ID) || [];
    
    // Sort by creation date (newest first)
    const sortedSearches = [...userSearches].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(sortedSearches);
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
    const { name, criteria, notifications } = await request.json();

    if (!name || !criteria) {
      return NextResponse.json(
        { error: 'Name and criteria are required' },
        { status: 400 }
      );
    }

    // Create new saved search
    const newSearch = {
      id: Date.now().toString(),
      name,
      criteria,
      notifications: notifications ?? true,
      createdAt: new Date().toISOString(),
    };

    // Get or initialize user's saved searches
    let userSearches = mockSavedSearches.get(MOCK_USER_ID) || [];
    
    // Add new search
    userSearches = [...userSearches, newSearch];
    mockSavedSearches.set(MOCK_USER_ID, userSearches);

    return NextResponse.json(newSearch);
  } catch (error) {
    console.error('Error saving search:', error);
    return NextResponse.json(
      { error: 'Failed to save search' },
      { status: 500 }
    );
  }
}
