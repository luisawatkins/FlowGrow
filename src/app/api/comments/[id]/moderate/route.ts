// Comment Moderation API Route

import { NextRequest, NextResponse } from 'next/server';
import { notesService } from '@/lib/notesService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { reason } = body;

    if (!reason || typeof reason !== 'string') {
      return NextResponse.json(
        { error: 'Moderation reason is required' },
        { status: 400 }
      );
    }

    const comment = await notesService.moderateComment(params.id, reason);
    return NextResponse.json(comment);
  } catch (error: any) {
    if (error.code === 'COMMENT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to moderate comment' },
      { status: 500 }
    );
  }
}
