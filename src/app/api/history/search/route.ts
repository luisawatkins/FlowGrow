import { NextRequest, NextResponse } from 'next/server';
import { historyService } from '@/lib/historyService';
import { HistorySearchQuery } from '@/types/history';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const searchQuery: HistorySearchQuery = {
      propertyId: body.propertyId,
      eventTypes: body.eventTypes,
      dateRange: body.dateRange ? {
        start: new Date(body.dateRange.start),
        end: new Date(body.dateRange.end)
      } : undefined,
      sources: body.sources,
      tags: body.tags,
      keywords: body.keywords,
      importance: body.importance
    };

    const response = await historyService.searchEvents(searchQuery, page, limit);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error searching history events:', error);
    return NextResponse.json(
      { error: 'Failed to search history events' },
      { status: 500 }
    );
  }
}
