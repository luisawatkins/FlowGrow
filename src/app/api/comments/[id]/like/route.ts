// Comment Like API Route

import { NextRequest, NextResponse } from 'next/server';
import { notesService } from '@/lib/notesService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comment = await notesService.likeComment(params.id);
    return NextResponse.json(comment);
  } catch (error: any) {
    if (error.code === 'COMMENT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to like comment' },
      { status: 500 }
    );
  }
}
