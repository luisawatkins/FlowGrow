// Neighborhood Demographics API Route
// Get demographics data for a specific neighborhood

import { NextRequest, NextResponse } from 'next/server';
import { neighborhoodService } from '@/lib/neighborhoodService';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Get neighborhood demographics
    const demographics = await neighborhoodService.getNeighborhoodDemographics(id);

    if (!demographics) {
      return NextResponse.json(
        { error: 'Neighborhood demographics not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(demographics);
  } catch (error) {
    console.error('Neighborhood demographics error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get neighborhood demographics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
