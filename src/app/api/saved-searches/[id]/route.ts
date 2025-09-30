import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Reference to mock data from parent route
declare const mockSavedSearches: Map<string, any[]>;
declare const MOCK_USER_ID: string;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const userSearches = mockSavedSearches.get(MOCK_USER_ID) || [];
    
    const searchIndex = userSearches.findIndex(
      search => search.id === params.id
    );

    if (searchIndex === -1) {
      return NextResponse.json(
        { error: 'Saved search not found' },
        { status: 404 }
      );
    }

    // Update search
    const updatedSearch = {
      ...userSearches[searchIndex],
      ...updates,
    };

    userSearches[searchIndex] = updatedSearch;
    mockSavedSearches.set(MOCK_USER_ID, userSearches);

    return NextResponse.json(updatedSearch);
  } catch (error) {
    console.error('Error updating saved search:', error);
    return NextResponse.json(
      { error: 'Failed to update saved search' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userSearches = mockSavedSearches.get(MOCK_USER_ID) || [];
    
    const searchIndex = userSearches.findIndex(
      search => search.id === params.id
    );

    if (searchIndex === -1) {
      return NextResponse.json(
        { error: 'Saved search not found' },
        { status: 404 }
      );
    }

    // Remove search
    userSearches.splice(searchIndex, 1);
    mockSavedSearches.set(MOCK_USER_ID, userSearches);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved search:', error);
    return NextResponse.json(
      { error: 'Failed to delete saved search' },
      { status: 500 }
    );
  }
}
