// Market Analysis API Route

import { NextRequest, NextResponse } from 'next/server';
import { marketService } from '@/lib/marketService';
import { MarketAnalysisRequest } from '@/types/market';

export async function POST(request: NextRequest) {
  try {
    const body: MarketAnalysisRequest = await request.json();
    
    // Validate required fields
    if (!body.location) {
      return NextResponse.json(
        { error: 'Missing required field: location' },
        { status: 400 }
      );
    }

    const analysis = await marketService.getMarketAnalysis(body);
    
    return NextResponse.json(analysis);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get market analysis' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType') as any;
    const marketType = searchParams.get('marketType') as any;

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    const analysisRequest: MarketAnalysisRequest = {
      location,
      propertyType,
      marketType,
      includeForecast: searchParams.get('includeForecast') === 'true',
      includeInsights: searchParams.get('includeInsights') === 'true',
      includeComparisons: searchParams.get('includeComparisons') === 'true'
    };

    const analysis = await marketService.getMarketAnalysis(analysisRequest);
    
    return NextResponse.json(analysis);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get market analysis' },
      { status: 500 }
    );
  }
}
