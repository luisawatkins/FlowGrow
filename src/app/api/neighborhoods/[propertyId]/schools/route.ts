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
    const range = parseFloat(searchParams.get('range') || '2');

    const neighborhood = mockNeighborhoods.get(params.propertyId);
    
    if (!neighborhood) {
      return NextResponse.json(
        { error: 'Neighborhood not found' },
        { status: 404 }
      );
    }

    // Filter schools within the specified range
    const schools = neighborhood.schools.filter(
      (school: any) => school.distance <= range
    );

    return NextResponse.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}
