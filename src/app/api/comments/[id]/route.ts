// Individual Comment API Route

import { NextRequest, NextResponse } from 'next/server';
import { notesService } from '@/lib/notesService';
import { UpdateCommentRequest } from '@/types/notes';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comment = await notesService.getComment(params.id);
    return NextResponse.json(comment);
  } catch (error: any) {
    if (error.code === 'COMMENT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to fetch comment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateCommentRequest = await request.json();
    const comment = await notesService.updateComment(params.id, body);
    return NextResponse.json(comment);
  } catch (error: any) {
    if (error.code === 'COMMENT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await notesService.deleteComment(params.id);
    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    if (error.code === 'COMMENT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
