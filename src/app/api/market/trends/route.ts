// Market Trends API Route

import { NextRequest, NextResponse } from 'next/server';
import { marketService } from '@/lib/marketService';
import { PropertyType } from '@/types/market';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType') as PropertyType;

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    const trends = await marketService.getMarketTrends(location, propertyType);
    
    return NextResponse.json(trends);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get market trends' },
      { status: 500 }
    );
  }
}
