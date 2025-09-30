// Individual Note API Route

import { NextRequest, NextResponse } from 'next/server';
import { notesService } from '@/lib/notesService';
import { UpdateNoteRequest } from '@/types/notes';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const note = await notesService.getNote(params.id);
    return NextResponse.json(note);
  } catch (error: any) {
    if (error.code === 'NOTE_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateNoteRequest = await request.json();
    const note = await notesService.updateNote(params.id, body);
    return NextResponse.json(note);
  } catch (error: any) {
    if (error.code === 'NOTE_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await notesService.deleteNote(params.id);
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error: any) {
    if (error.code === 'NOTE_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete note' },
      { status: 500 }
    );
  }
}
