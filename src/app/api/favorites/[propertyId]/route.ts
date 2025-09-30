import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Mock database for favorites
const favorites = new Map<string, Set<string>>();

export async function POST(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const propertyId = params.propertyId;

    // Get or create user's favorites set
    if (!favorites.has(userId)) {
      favorites.set(userId, new Set());
    }

    const userFavorites = favorites.get(userId)!;
    userFavorites.add(propertyId);

    return NextResponse.json({
      message: 'Property added to favorites',
      propertyId,
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add property to favorites' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const propertyId = params.propertyId;

    const userFavorites = favorites.get(userId);
    if (userFavorites) {
      userFavorites.delete(propertyId);
    }

    return NextResponse.json({
      message: 'Property removed from favorites',
      propertyId,
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove property from favorites' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const propertyId = params.propertyId;

    const userFavorites = favorites.get(userId);
    const isFavorite = userFavorites?.has(propertyId) ?? false;

    return NextResponse.json({ isFavorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json(
      { error: 'Failed to check favorite status' },
      { status: 500 }
    );
  }
}
