// Neighborhood Crime Statistics API Route
// Get crime statistics for a specific neighborhood

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

    // Get neighborhood crime statistics
    const crimeStats = await neighborhoodService.getCrimeStatistics(id);

    if (!crimeStats) {
      return NextResponse.json(
        { error: 'Neighborhood crime statistics not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(crimeStats);
  } catch (error) {
    console.error('Neighborhood crime statistics error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get neighborhood crime statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
