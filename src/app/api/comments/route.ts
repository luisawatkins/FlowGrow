// Comments API Route

import { NextRequest, NextResponse } from 'next/server';
import { notesService } from '@/lib/notesService';
import { CreateCommentRequest, CommentsFilter } from '@/types/notes';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const userId = searchParams.get('userId');
    const parentId = searchParams.get('parentId');
    const isApproved = searchParams.get('isApproved');
    const isModerated = searchParams.get('isModerated');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filter: CommentsFilter = {
      propertyId: propertyId || undefined,
      userId: userId || undefined,
      parentId: parentId || undefined,
      isApproved: isApproved ? isApproved === 'true' : undefined,
      isModerated: isModerated ? isModerated === 'true' : undefined,
      search: search || undefined
    };

    let comments;
    if (propertyId) {
      comments = await notesService.getCommentsByProperty(propertyId, filter);
    } else {
      // Return empty array if no property specified
      comments = [];
    }

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = comments.slice(startIndex, endIndex);

    return NextResponse.json({
      comments: paginatedComments,
      total: comments.length,
      page,
      limit,
      totalPages: Math.ceil(comments.length / limit)
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCommentRequest = await request.json();
    
    // Validate required fields
    if (!body.propertyId || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: propertyId, content' },
        { status: 400 }
      );
    }

    const comment = await notesService.createComment(body);
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create comment' },
      { status: 500 }
    );
  }
}
