// Market Insights API Route

import { NextRequest, NextResponse } from 'next/server';
import { marketService } from '@/lib/marketService';
import { MarketInsightFilter } from '@/types/market';

export async function POST(request: NextRequest) {
  try {
    const body: MarketInsightFilter = await request.json();
    
    const insights = await marketService.getMarketInsights(body);
    
    return NextResponse.json(insights);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get market insights' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType') as any;
    const insightType = searchParams.get('insightType') as any;
    const impact = searchParams.get('impact') as any;
    const minConfidence = searchParams.get('minConfidence');
    const tags = searchParams.get('tags');

    const filter: MarketInsightFilter = {
      location: location || undefined,
      propertyType: propertyType || undefined,
      insightType: insightType || undefined,
      impact: impact || undefined,
      minConfidence: minConfidence ? parseFloat(minConfidence) : undefined,
      tags: tags ? tags.split(',') : undefined
    };

    const insights = await marketService.getMarketInsights(filter);
    
    return NextResponse.json(insights);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get market insights' },
      { status: 500 }
    );
  }
}
