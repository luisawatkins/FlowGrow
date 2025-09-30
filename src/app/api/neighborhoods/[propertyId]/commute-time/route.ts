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
    const destination = searchParams.get('destination');
    const mode = searchParams.get('mode') || 'driving';

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination is required' },
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

    // Find matching commute time or calculate estimate
    const commuteTime = neighborhood.transportation.commuteTimes.find(
      (time: any) =>
        time.destination.toLowerCase() === destination.toLowerCase() &&
        time.mode === mode
    );

    if (!commuteTime) {
      // In a real application, you would:
      // 1. Use a mapping service API (e.g., Google Maps)
      // 2. Calculate real-time commute estimates
      // 3. Consider traffic patterns
      // 4. Cache results

      // Mock estimated time
      return NextResponse.json({
        destination,
        time: Math.round(Math.random() * 30 + 15),
        mode,
      });
    }

    return NextResponse.json(commuteTime);
  } catch (error) {
    console.error('Error fetching commute time:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commute time' },
      { status: 500 }
    );
  }
}
