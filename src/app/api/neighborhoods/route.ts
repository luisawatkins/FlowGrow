// Neighborhood API Routes
// Main neighborhood search and listing endpoints

import { NextRequest, NextResponse } from 'next/server';
import { neighborhoodService } from '@/lib/neighborhoodService';
import { NeighborhoodSearchRequest } from '@/types/neighborhood';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const query = searchParams.get('query') || undefined;
    const city = searchParams.get('city') || undefined;
    const state = searchParams.get('state') || undefined;
    const zipCode = searchParams.get('zipCode') || undefined;
    const minPopulation = searchParams.get('minPopulation') ? parseInt(searchParams.get('minPopulation')!) : undefined;
    const maxPopulation = searchParams.get('maxPopulation') ? parseInt(searchParams.get('maxPopulation')!) : undefined;
    const minMedianIncome = searchParams.get('minMedianIncome') ? parseInt(searchParams.get('minMedianIncome')!) : undefined;
    const maxMedianIncome = searchParams.get('maxMedianIncome') ? parseInt(searchParams.get('maxMedianIncome')!) : undefined;
    const minWalkabilityScore = searchParams.get('minWalkabilityScore') ? parseInt(searchParams.get('minWalkabilityScore')!) : undefined;
    const maxWalkabilityScore = searchParams.get('maxWalkabilityScore') ? parseInt(searchParams.get('maxWalkabilityScore')!) : undefined;
    const minSafetyScore = searchParams.get('minSafetyScore') ? parseFloat(searchParams.get('minSafetyScore')!) : undefined;
    const maxSafetyScore = searchParams.get('maxSafetyScore') ? parseFloat(searchParams.get('maxSafetyScore')!) : undefined;
    const maxCommuteTime = searchParams.get('maxCommuteTime') ? parseInt(searchParams.get('maxCommuteTime')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const sortBy = searchParams.get('sortBy') as 'relevance' | 'distance' | 'score' | 'name' || 'relevance';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';

    // Parse location parameters
    const latitude = searchParams.get('latitude') ? parseFloat(searchParams.get('latitude')!) : undefined;
    const longitude = searchParams.get('longitude') ? parseFloat(searchParams.get('longitude')!) : undefined;
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : undefined;

    // Parse array parameters
    const amenityTypes = searchParams.get('amenityTypes')?.split(',') || undefined;
    const schoolTypes = searchParams.get('schoolTypes')?.split(',') || undefined;
    const propertyTypes = searchParams.get('propertyTypes')?.split(',') || undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;

    // Parse price range
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;

    // Build search request
    const searchRequest: NeighborhoodSearchRequest = {
      query,
      filters: {
        city,
        state,
        zipCode,
        minPopulation,
        maxPopulation,
        minMedianIncome,
        maxMedianIncome,
        minWalkabilityScore,
        maxWalkabilityScore,
        minSafetyScore,
        maxSafetyScore,
        maxCommuteTime,
        amenityTypes: amenityTypes as any,
        schoolTypes: schoolTypes as any,
        propertyTypes: propertyTypes as any,
        tags,
        priceRange: (minPrice || maxPrice) ? { min: minPrice, max: maxPrice } : undefined
      },
      location: (latitude && longitude && radius) ? {
        latitude,
        longitude,
        radius
      } : undefined,
      limit,
      offset,
      sortBy,
      sortOrder
    };

    // Perform search
    const results = await neighborhoodService.searchNeighborhoods(searchRequest);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Neighborhood search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search neighborhoods',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.query && !body.filters && !body.location) {
      return NextResponse.json(
        { error: 'At least one search parameter is required' },
        { status: 400 }
      );
    }

    // Perform search
    const results = await neighborhoodService.searchNeighborhoods(body);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Neighborhood search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search neighborhoods',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
