import { NextRequest, NextResponse } from 'next/server';
import { comparisonService } from '@/lib/comparisonService';
import { AddPropertyToComparisonRequest, RemovePropertyFromComparisonRequest } from '@/types/comparison';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, ...propertyData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const response = await comparisonService.addPropertyToComparison(
      params.id,
      propertyData as AddPropertyToComparisonRequest,
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
    console.error('Error adding property to comparison:', error);
    return NextResponse.json(
      { error: 'Failed to add property to comparison' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, ...propertyData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const response = await comparisonService.removePropertyFromComparison(
      params.id,
      propertyData as RemovePropertyFromComparisonRequest,
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
    console.error('Error removing property from comparison:', error);
    return NextResponse.json(
      { error: 'Failed to remove property from comparison' },
      { status: 500 }
    );
  }
}
