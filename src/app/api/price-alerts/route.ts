import { NextRequest, NextResponse } from 'next/server';
import { wishlistService } from '@/lib/wishlistService';
import { CreatePriceAlertRequest } from '@/types/wishlist';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const response = await wishlistService.getUserPriceAlerts(userId, page, limit);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching price alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...alertData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const response = await wishlistService.createPriceAlert(
      alertData as CreatePriceAlertRequest,
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
    console.error('Error creating price alert:', error);
    return NextResponse.json(
      { error: 'Failed to create price alert' },
      { status: 500 }
    );
  }
}
