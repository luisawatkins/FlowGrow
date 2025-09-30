import { NextRequest, NextResponse } from 'next/server';
import { socialService } from '@/lib/socialService';
import { UpdateShareRequest } from '@/types/social';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const updateData = body as UpdateShareRequest;

    const userId = 'mock-user-123'; // In real app, get from auth context
    const response = await socialService.updateShare(params.id, updateData, userId);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating share:', error);
    return NextResponse.json(
      { error: 'Failed to update share' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = 'mock-user-123'; // In real app, get from auth context
    const response = await socialService.deleteShare(params.id, userId);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 404 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting share:', error);
    return NextResponse.json(
      { error: 'Failed to delete share' },
      { status: 500 }
    );
  }
}
