import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Reference to mock data from parent route
declare const mockNeighborhoods: Map<string, any>;

export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const range = parseFloat(searchParams.get('range') || '1');

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    const neighborhood = mockNeighborhoods.get(params.propertyId);
    
    if (!neighborhood) {
      return NextResponse.json(
        { error: 'Neighborhood not found' },
        { status: 404 }
      );
    }

    // Get amenities for the specified category within range
    const amenities = neighborhood.amenities[category.toLowerCase()]?.filter(
      (amenity: any) => amenity.distance <= range
    );

    if (!amenities) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    return NextResponse.json(amenities);
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch amenities' },
      { status: 500 }
    );
  }
}
