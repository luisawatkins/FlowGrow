import { NextRequest, NextResponse } from 'next/server';
import { historyService } from '@/lib/historyService';
import { UpdateHistoryEventRequest } from '@/types/history';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const response = await historyService.getEvent(params.id);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 404 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching history event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history event' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const updateData = body as UpdateHistoryEventRequest;

    const response = await historyService.updateEvent(params.id, updateData);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating history event:', error);
    return NextResponse.json(
      { error: 'Failed to update history event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const response = await historyService.deleteEvent(params.id);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 404 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting history event:', error);
    return NextResponse.json(
      { error: 'Failed to delete history event' },
      { status: 500 }
    );
  }
}
