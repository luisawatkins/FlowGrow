import { NextRequest, NextResponse } from 'next/server';
import { wishlistService } from '@/lib/wishlistService';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const analytics = await wishlistService.getWishlistAnalytics(params.id, userId);

    if (!analytics) {
      return NextResponse.json(
        { error: 'Wishlist not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error fetching wishlist analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist analytics' },
      { status: 500 }
    );
  }
}
