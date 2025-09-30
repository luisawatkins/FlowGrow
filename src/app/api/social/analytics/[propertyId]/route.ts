import { NextRequest, NextResponse } from 'next/server';
import { socialService } from '@/lib/socialService';

interface RouteParams {
  params: {
    propertyId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'day' | 'week' | 'month' | 'year' || 'week';

    const analytics = await socialService.getSocialAnalytics(params.propertyId, period);

    if (!analytics) {
      return NextResponse.json(
        { error: 'Analytics not found for this property' },
        { status: 404 }
      );
    }

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error fetching social analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social analytics' },
      { status: 500 }
    );
  }
}
