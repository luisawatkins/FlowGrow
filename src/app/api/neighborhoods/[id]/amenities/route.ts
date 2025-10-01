// Neighborhood Amenities API Route
// Get amenities for a specific neighborhood

import { NextRequest, NextResponse } from 'next/server';
import { neighborhoodService } from '@/lib/neighborhoodService';
import { AmenitySearchRequest } from '@/types/neighborhood';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const type = searchParams.get('type') || undefined;
    const category = searchParams.get('category') || undefined;
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const sortBy = searchParams.get('sortBy') as 'distance' | 'rating' | 'name' || 'distance';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc';

    // Build amenity search request
    const amenityRequest: AmenitySearchRequest = {
      neighborhoodId: id,
      type: type as any,
      category: category as any,
      radius,
      limit,
      offset,
      sortBy,
      sortOrder
    };

    // Search amenities
    const results = await neighborhoodService.searchAmenities(amenityRequest);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Neighborhood amenities error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get neighborhood amenities',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
