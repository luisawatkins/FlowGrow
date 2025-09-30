import { NextRequest, NextResponse } from 'next/server';
import { socialService } from '@/lib/socialService';
import { CreateCommentRequest } from '@/types/social';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const commentData = body as CreateCommentRequest;

    const userId = 'mock-user-123'; // In real app, get from auth context
    const response = await socialService.createComment(commentData, userId);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
