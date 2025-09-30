import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

interface VirtualTourScene {
  id: string;
  name: string;
  imageUrl: string;
  hotspots: {
    id: string;
    position: { x: number; y: number; z: number };
    tooltip: string;
    type: 'info' | 'navigation';
    targetSceneId?: string;
  }[];
}

interface VirtualTour {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  scenes: VirtualTourScene[];
  defaultSceneId: string;
  createdAt: string;
  updatedAt: string;
}

// Mock database for virtual tours
const virtualTours = new Map<string, VirtualTour>([
  ['1', {
    id: '1',
    propertyId: '1',
    title: 'Modern Downtown Apartment Tour',
    description: 'Take a virtual walk through this stunning downtown apartment',
    scenes: [
      {
        id: 'living-room',
        name: 'Living Room',
        imageUrl: '/virtual-tours/apartment1/living-room.jpg',
        hotspots: [
          {
            id: 'living-room-kitchen',
            position: { x: 1, y: 0, z: -2 },
            tooltip: 'Go to Kitchen',
            type: 'navigation',
            targetSceneId: 'kitchen'
          },
          {
            id: 'living-room-info',
            position: { x: -1, y: 1, z: -1 },
            tooltip: 'Large windows with city view',
            type: 'info'
          }
        ]
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        imageUrl: '/virtual-tours/apartment1/kitchen.jpg',
        hotspots: [
          {
            id: 'kitchen-living-room',
            position: { x: -1, y: 0, z: 2 },
            tooltip: 'Back to Living Room',
            type: 'navigation',
            targetSceneId: 'living-room'
          },
          {
            id: 'kitchen-info',
            position: { x: 1, y: 1, z: 1 },
            tooltip: 'Modern appliances included',
            type: 'info'
          }
        ]
      }
    ],
    defaultSceneId: 'living-room',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }]
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tourId = params.id;
    const tour = virtualTours.get(tourId);

    if (!tour) {
      return NextResponse.json(
        { error: 'Virtual tour not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error fetching virtual tour:', error);
    return NextResponse.json(
      { error: 'Failed to fetch virtual tour' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const propertyId = params.id;
    const { title, description, scenes, defaultSceneId } = await request.json();

    // Validate required fields
    if (!title || !scenes || !defaultSceneId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new virtual tour
    const newTour: VirtualTour = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId,
      title,
      description,
      scenes,
      defaultSceneId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    virtualTours.set(newTour.id, newTour);

    return NextResponse.json(newTour);
  } catch (error) {
    console.error('Error creating virtual tour:', error);
    return NextResponse.json(
      { error: 'Failed to create virtual tour' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const tourId = params.id;
    const tour = virtualTours.get(tourId);

    if (!tour) {
      return NextResponse.json(
        { error: 'Virtual tour not found' },
        { status: 404 }
      );
    }

    const updates = await request.json();
    const updatedTour = {
      ...tour,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    virtualTours.set(tourId, updatedTour);

    return NextResponse.json(updatedTour);
  } catch (error) {
    console.error('Error updating virtual tour:', error);
    return NextResponse.json(
      { error: 'Failed to update virtual tour' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const tourId = params.id;
    const tour = virtualTours.get(tourId);

    if (!tour) {
      return NextResponse.json(
        { error: 'Virtual tour not found' },
        { status: 404 }
      );
    }

    virtualTours.delete(tourId);

    return NextResponse.json({
      message: 'Virtual tour deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting virtual tour:', error);
    return NextResponse.json(
      { error: 'Failed to delete virtual tour' },
      { status: 500 }
    );
  }
}