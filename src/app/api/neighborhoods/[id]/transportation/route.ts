// Neighborhood Transportation API Route
// Get transportation information for a specific neighborhood

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

    // Get neighborhood transportation info
    const transportation = await neighborhoodService.getTransportationInfo(id);

    if (!transportation) {
      return NextResponse.json(
        { error: 'Neighborhood transportation information not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(transportation);
  } catch (error) {
    console.error('Neighborhood transportation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get neighborhood transportation information',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
