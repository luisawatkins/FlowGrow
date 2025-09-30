import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock virtual tour data (replace with actual database integration)
const mockTours = new Map([
  ['1', {
    id: '1',
    title: 'Modern Downtown Apartment Virtual Tour',
    scenes: [
      {
        id: 'living-room',
        name: 'Living Room',
        thumbnail: '/images/virtual-tours/living-room-thumb.jpg',
        panoramaUrl: '/images/virtual-tours/living-room-360.jpg',
        initialViewParameters: {
          pitch: 0,
          yaw: 0,
          zoom: 1,
        },
        hotspots: [
          {
            id: 'to-kitchen',
            type: 'scene',
            pitch: -10,
            yaw: 45,
            targetSceneId: 'kitchen',
            title: 'Go to Kitchen',
          },
          {
            id: 'window-view',
            type: 'info',
            pitch: 0,
            yaw: -90,
            title: 'City View',
            description: 'Stunning views of the downtown skyline',
          },
        ],
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        thumbnail: '/images/virtual-tours/kitchen-thumb.jpg',
        panoramaUrl: '/images/virtual-tours/kitchen-360.jpg',
        initialViewParameters: {
          pitch: 0,
          yaw: 180,
          zoom: 1,
        },
        hotspots: [
          {
            id: 'to-living-room',
            type: 'scene',
            pitch: -10,
            yaw: -135,
            targetSceneId: 'living-room',
            title: 'Back to Living Room',
          },
          {
            id: 'appliances',
            type: 'info',
            pitch: 0,
            yaw: 45,
            title: 'Modern Appliances',
            description: 'High-end stainless steel appliances',
          },
        ],
      },
    ],
    autoRotate: true,
    autoRotateSpeed: 0.5,
  }],
  ['2', {
    id: '2',
    title: 'Suburban Family Home Virtual Tour',
    scenes: [
      {
        id: 'entrance',
        name: 'Entrance',
        thumbnail: '/images/virtual-tours/entrance-thumb.jpg',
        panoramaUrl: '/images/virtual-tours/entrance-360.jpg',
        initialViewParameters: {
          pitch: 0,
          yaw: 0,
          zoom: 1,
        },
        hotspots: [
          {
            id: 'to-living-area',
            type: 'scene',
            pitch: -10,
            yaw: 0,
            targetSceneId: 'living-area',
            title: 'Enter Living Area',
          },
        ],
      },
      {
        id: 'living-area',
        name: 'Living Area',
        thumbnail: '/images/virtual-tours/living-area-thumb.jpg',
        panoramaUrl: '/images/virtual-tours/living-area-360.jpg',
        initialViewParameters: {
          pitch: 0,
          yaw: 90,
          zoom: 1,
        },
        hotspots: [
          {
            id: 'to-entrance',
            type: 'scene',
            pitch: -10,
            yaw: 180,
            targetSceneId: 'entrance',
            title: 'Back to Entrance',
          },
          {
            id: 'fireplace',
            type: 'info',
            pitch: 0,
            yaw: -45,
            title: 'Fireplace',
            description: 'Natural stone fireplace with gas insert',
          },
        ],
      },
    ],
    autoRotate: true,
    autoRotateSpeed: 0.5,
  }],
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const tour = mockTours.get(params.id);
    
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
