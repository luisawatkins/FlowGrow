import { NextRequest, NextResponse } from 'next/server';
import { wishlistService } from '@/lib/wishlistService';
import { AddPropertyToWishlistRequest, RemovePropertyFromWishlistRequest } from '@/types/wishlist';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { userId, ...propertyData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const response = await wishlistService.addPropertyToWishlist(
      params.id,
      propertyData as AddPropertyToWishlistRequest,
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
    console.error('Error adding property to wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to add property to wishlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { userId, ...propertyData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const response = await wishlistService.removePropertyFromWishlist(
      params.id,
      propertyData as RemovePropertyFromWishlistRequest,
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
    console.error('Error removing property from wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove property from wishlist' },
      { status: 500 }
    );
  }
}
