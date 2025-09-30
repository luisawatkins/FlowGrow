// Notes API Route

import { NextRequest, NextResponse } from 'next/server';
import { notesService } from '@/lib/notesService';
import { CreateNoteRequest, NotesFilter } from '@/types/notes';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') as any;
    const isPrivate = searchParams.get('isPrivate');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filter: NotesFilter = {
      propertyId: propertyId || undefined,
      userId: userId || undefined,
      type: type || undefined,
      isPrivate: isPrivate ? isPrivate === 'true' : undefined,
      search: search || undefined
    };

    let notes;
    if (search) {
      notes = await notesService.searchNotes(search, filter);
    } else if (propertyId) {
      notes = await notesService.getNotesByProperty(propertyId, filter);
    } else {
      // Return empty array if no specific query
      notes = [];
    }

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotes = notes.slice(startIndex, endIndex);

    return NextResponse.json({
      notes: paginatedNotes,
      total: notes.length,
      page,
      limit,
      totalPages: Math.ceil(notes.length / limit)
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateNoteRequest = await request.json();
    
    // Validate required fields
    if (!body.propertyId || !body.title || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: propertyId, title, content' },
        { status: 400 }
      );
    }

    const note = await notesService.createNote(body);
    
    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create note' },
      { status: 500 }
    );
  }
}
