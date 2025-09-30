import { NextRequest, NextResponse } from 'next/server';
import { socialService } from '@/lib/socialService';
import { UpdateFollowRequest } from '@/types/social';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const updateData = body as UpdateFollowRequest;

    const userId = 'mock-user-123'; // In real app, get from auth context
    const response = await socialService.updateFollow(params.id, updateData, userId);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating follow:', error);
    return NextResponse.json(
      { error: 'Failed to update follow' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = 'mock-user-123'; // In real app, get from auth context
    const response = await socialService.deleteFollow(params.id, userId);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 404 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting follow:', error);
    return NextResponse.json(
      { error: 'Failed to delete follow' },
      { status: 500 }
    );
  }
}
