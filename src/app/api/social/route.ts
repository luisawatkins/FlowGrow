import { NextRequest, NextResponse } from 'next/server';
import { socialService } from '@/lib/socialService';
import { CreateShareRequest } from '@/types/social';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const response = await socialService.getPropertySocialData(propertyId);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 404 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching property social data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property social data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const shareData = body as CreateShareRequest;

    const userId = 'mock-user-123'; // In real app, get from auth context
    const response = await socialService.createShare(shareData, userId);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating share:', error);
    return NextResponse.json(
      { error: 'Failed to create share' },
      { status: 500 }
    );
  }
}
