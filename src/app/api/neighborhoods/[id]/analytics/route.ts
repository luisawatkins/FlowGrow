// Neighborhood Analytics API Route
// Get analytics and analysis for a specific neighborhood

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

    // Get neighborhood analysis
    const analysis = await neighborhoodService.getNeighborhoodAnalysis(id);

    if (!analysis) {
      return NextResponse.json(
        { error: 'Neighborhood analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Neighborhood analytics error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get neighborhood analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
