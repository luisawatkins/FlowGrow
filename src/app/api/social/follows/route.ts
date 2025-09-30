import { NextRequest, NextResponse } from 'next/server';
import { socialService } from '@/lib/socialService';
import { CreateFollowRequest } from '@/types/social';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const followData = body as CreateFollowRequest;

    const userId = 'mock-user-123'; // In real app, get from auth context
    const response = await socialService.createFollow(followData, userId);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating follow:', error);
    return NextResponse.json(
      { error: 'Failed to create follow' },
      { status: 500 }
    );
  }
}
