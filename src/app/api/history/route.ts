import { NextRequest, NextResponse } from 'next/server';
import { historyService } from '@/lib/historyService';
import { CreateHistoryEventRequest } from '@/types/history';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const response = await historyService.getPropertyTimeline({
      propertyId,
      page,
      limit
    });

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 404 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching property history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventData = body as CreateHistoryEventRequest;

    const response = await historyService.createEvent(eventData);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating history event:', error);
    return NextResponse.json(
      { error: 'Failed to create history event' },
      { status: 500 }
    );
  }
}
