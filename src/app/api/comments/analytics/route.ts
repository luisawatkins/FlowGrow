// Comments Analytics API Route

import { NextRequest, NextResponse } from 'next/server';
import { notesService } from '@/lib/notesService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    const analytics = await notesService.getCommentsAnalytics(propertyId || undefined);
    
    return NextResponse.json(analytics);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch comments analytics' },
      { status: 500 }
    );
  }
}
