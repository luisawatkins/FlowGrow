import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  targetType: 'property' | 'agent';
  targetId: string;
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
  isVerifiedBuyer: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

// Mock database for reviews
const reviews = new Map<string, Review[]>();
const helpfulVotes = new Map<string, Set<string>>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('targetType');
    const targetId = searchParams.get('targetId');
    const sortBy = searchParams.get('sortBy') || 'recent';

    if (!targetType || !targetId) {
      return NextResponse.json(
        { error: 'Target type and ID are required' },
        { status: 400 }
      );
    }

    const targetReviews = reviews.get(`${targetType}-${targetId}`) || [];

    // Sort reviews
    let sortedReviews = [...targetReviews];
    switch (sortBy) {
      case 'helpful':
        sortedReviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      case 'rating-high':
        sortedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        sortedReviews.sort((a, b) => a.rating - b.rating);
        break;
      case 'recent':
      default:
        sortedReviews.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    // Calculate summary statistics
    const totalReviews = sortedReviews.length;
    const averageRating =
      totalReviews > 0
        ? sortedReviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;
    const ratingDistribution = Array(5)
      .fill(0)
      .map((_, i) => ({
        rating: i + 1,
        count: sortedReviews.filter((r) => r.rating === i + 1).length,
      }));

    return NextResponse.json({
      reviews: sortedReviews,
      summary: {
        totalReviews,
        averageRating,
        ratingDistribution,
        verifiedBuyerCount: sortedReviews.filter((r) => r.isVerifiedBuyer).length,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const {
      targetType,
      targetId,
      rating,
      title,
      content,
      pros,
      cons,
      images,
    } = await request.json();

    // Validate required fields
    if (!targetType || !targetId || !rating || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const review: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userId: (session.user as any).id,
      userName: session.user.name || 'Anonymous',
      userImage: session.user.image,
      targetType,
      targetId,
      rating,
      title,
      content,
      pros: pros || [],
      cons: cons || [],
      images: images || [],
      isVerifiedBuyer: false, // In a real app, check transaction history
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const targetKey = `${targetType}-${targetId}`;
    const targetReviews = reviews.get(targetKey) || [];
    targetReviews.push(review);
    reviews.set(targetKey, targetReviews);

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { reviewId, action } = await request.json();
    if (!reviewId || !action) {
      return NextResponse.json(
        { error: 'Review ID and action are required' },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;

    // Handle helpful votes
    if (action === 'helpful') {
      const voters = helpfulVotes.get(reviewId) || new Set();
      const hasVoted = voters.has(userId);

      if (hasVoted) {
        voters.delete(userId);
      } else {
        voters.add(userId);
      }

      helpfulVotes.set(reviewId, voters);

      // Update helpful count in all reviews
      for (const [key, reviewList] of reviews.entries()) {
        const updatedReviews = reviewList.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                helpfulCount: voters.size,
                updatedAt: new Date().toISOString(),
              }
            : review
        );
        reviews.set(key, updatedReviews);
      }

      return NextResponse.json({
        message: hasVoted ? 'Vote removed' : 'Vote added',
        helpfulCount: voters.size,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
