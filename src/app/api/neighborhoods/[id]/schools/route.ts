// Neighborhood Schools API Route
// Get school districts for a specific neighborhood

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

    // Get neighborhood school districts
    const schools = await neighborhoodService.getSchoolDistricts(id);

    return NextResponse.json(schools);
  } catch (error) {
    console.error('Neighborhood schools error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get neighborhood school districts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
