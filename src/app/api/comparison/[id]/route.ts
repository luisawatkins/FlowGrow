import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Reference to mock data from parent route
declare const mockProperties: Map<string, any>;
declare const mockComparisonLists: Map<string, Set<string>>;
declare const MOCK_USER_ID: string;

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userComparison = mockComparisonLists.get(MOCK_USER_ID);
    
    if (!userComparison) {
      return NextResponse.json(
        { error: 'Comparison list not found' },
        { status: 404 }
      );
    }

    // Remove from comparison
    userComparison.delete(params.id);

    // Return updated list with full property details
    const properties = Array.from(userComparison)
      .map(id => mockProperties.get(id))
      .filter(Boolean);

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error removing from comparison:', error);
    return NextResponse.json(
      { error: 'Failed to remove from comparison' },
      { status: 500 }
    );
  }
}