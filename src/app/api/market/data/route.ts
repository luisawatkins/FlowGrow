// Market Data API Route

import { NextRequest, NextResponse } from 'next/server';
import { marketService } from '@/lib/marketService';
import { MarketDataRequest } from '@/types/market';

export async function POST(request: NextRequest) {
  try {
    const body: MarketDataRequest = await request.json();
    
    // Validate required fields
    if (!body.location || !body.dataType) {
      return NextResponse.json(
        { error: 'Missing required fields: location, dataType' },
        { status: 400 }
      );
    }

    const data = await marketService.getMarketData(body);
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get market data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const dataType = searchParams.get('dataType') as any;
    const propertyType = searchParams.get('propertyType') as any;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!location || !dataType) {
      return NextResponse.json(
        { error: 'Location and dataType parameters are required' },
        { status: 400 }
      );
    }

    const dataRequest: MarketDataRequest = {
      location,
      dataType,
      propertyType,
      timeRange: startDate && endDate ? {
        start: new Date(startDate),
        end: new Date(endDate)
      } : undefined
    };

    const data = await marketService.getMarketData(dataRequest);
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get market data' },
      { status: 500 }
    );
  }
}
