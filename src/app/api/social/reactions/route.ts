import { NextRequest, NextResponse } from 'next/server';
import { socialService } from '@/lib/socialService';
import { CreateReactionRequest } from '@/types/social';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reactionData = body as CreateReactionRequest;

    const userId = 'mock-user-123'; // In real app, get from auth context
    const response = await socialService.createReaction(reactionData, userId);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating reaction:', error);
    return NextResponse.json(
      { error: 'Failed to create reaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const reactionType = searchParams.get('reactionType');

    if (!propertyId || !reactionType) {
      return NextResponse.json(
        { error: 'Property ID and reaction type are required' },
        { status: 400 }
      );
    }

    const userId = 'mock-user-123'; // In real app, get from auth context
    const response = await socialService.removeReaction(propertyId, reactionType as any, userId);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 404 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error removing reaction:', error);
    return NextResponse.json(
      { error: 'Failed to remove reaction' },
      { status: 500 }
    );
  }
}
