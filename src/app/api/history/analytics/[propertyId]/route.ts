import { NextRequest, NextResponse } from 'next/server';
import { historyService } from '@/lib/historyService';

interface RouteParams {
  params: {
    propertyId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const analytics = await historyService.getHistoryAnalytics(params.propertyId);

    if (!analytics) {
      return NextResponse.json(
        { error: 'Analytics not found for this property' },
        { status: 404 }
      );
    }

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error fetching history analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history analytics' },
      { status: 500 }
    );
  }
}
