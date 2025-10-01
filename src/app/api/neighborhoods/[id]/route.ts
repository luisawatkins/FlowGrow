// Neighborhood Details API Route
// Get detailed information about a specific neighborhood

import { NextRequest, NextResponse } from 'next/server';
import { neighborhoodService } from '@/lib/neighborhoodService';
import { NeighborhoodDetailsRequest } from '@/types/neighborhood';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);

    // Parse include parameters
    const includeAmenities = searchParams.get('includeAmenities') === 'true';
    const includeDemographics = searchParams.get('includeDemographics') === 'true';
    const includeSchools = searchParams.get('includeSchools') === 'true';
    const includeCrime = searchParams.get('includeCrime') === 'true';
    const includeTransportation = searchParams.get('includeTransportation') === 'true';
    const includeAnalysis = searchParams.get('includeAnalysis') === 'true';

    // Build details request
    const detailsRequest: NeighborhoodDetailsRequest = {
      neighborhoodId: id,
      includeAmenities,
      includeDemographics,
      includeSchools,
      includeCrime,
      includeTransportation,
      includeAnalysis
    };

    // Get neighborhood details
    const details = await neighborhoodService.getNeighborhoodDetails(detailsRequest);

    if (!details) {
      return NextResponse.json(
        { error: 'Neighborhood not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(details);
  } catch (error) {
    console.error('Neighborhood details error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get neighborhood details',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
