import { NextRequest, NextResponse } from 'next/server';
import { wishlistService } from '@/lib/wishlistService';
import { UpdatePriceAlertRequest } from '@/types/wishlist';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const response = await wishlistService.updatePriceAlert(
      params.id,
      updateData as UpdatePriceAlertRequest,
      userId
    );

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating price alert:', error);
    return NextResponse.json(
      { error: 'Failed to update price alert' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const response = await wishlistService.deletePriceAlert(params.id, userId);

    if (!response.success) {
      return NextResponse.json(
        { error: response.message },
        { status: 404 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting price alert:', error);
    return NextResponse.json(
      { error: 'Failed to delete price alert' },
      { status: 500 }
    );
  }
}
