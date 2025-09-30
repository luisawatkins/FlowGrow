import { NextRequest, NextResponse } from 'next/server';
import { comparisonService } from '@/lib/comparisonService';
import { CreateComparisonRequest } from '@/types/comparison';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const query = searchParams.get('query') || '';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let response;
    if (query) {
      response = await comparisonService.searchComparisons(query, userId);
    } else {
      response = await comparisonService.getUserComparisons(userId, page, limit);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching comparisons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comparisons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...comparisonData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const response = await comparisonService.createComparison(
      comparisonData as CreateComparisonRequest,
      userId
    );

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating comparison:', error);
    return NextResponse.json(
      { error: 'Failed to create comparison' },
      { status: 500 }
    );
  }
}
