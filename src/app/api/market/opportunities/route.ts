// Market Opportunities API Route

import { NextRequest, NextResponse } from 'next/server';
import { marketService } from '@/lib/marketService';
import { MarketOpportunityFilter } from '@/types/market';

export async function POST(request: NextRequest) {
  try {
    const body: MarketOpportunityFilter = await request.json();
    
    const opportunities = await marketService.getInvestmentOpportunities(body);
    
    return NextResponse.json(opportunities);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get investment opportunities' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType') as any;
    const opportunityType = searchParams.get('opportunityType') as any;
    const riskLevel = searchParams.get('riskLevel') as any;
    const timeHorizon = searchParams.get('timeHorizon') as any;
    const minPotentialReturn = searchParams.get('minPotentialReturn');
    const maxRiskLevel = searchParams.get('maxRiskLevel') as any;

    const filter: MarketOpportunityFilter = {
      location: location || undefined,
      propertyType: propertyType || undefined,
      opportunityType: opportunityType || undefined,
      riskLevel: riskLevel || undefined,
      timeHorizon: timeHorizon || undefined,
      minPotentialReturn: minPotentialReturn ? parseFloat(minPotentialReturn) : undefined,
      maxRiskLevel: maxRiskLevel || undefined
    };

    const opportunities = await marketService.getInvestmentOpportunities(filter);
    
    return NextResponse.json(opportunities);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get investment opportunities' },
      { status: 500 }
    );
  }
}
