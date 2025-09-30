import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock floor plan data (replace with actual database integration)
const mockFloorPlans = new Map([
  ['1', {
    id: '1',
    propertyId: '1',
    floors: [
      {
        id: 'ground',
        name: 'Ground Floor',
        level: 0,
        imageUrl: '/images/floor-plans/ground-floor.jpg',
        dimensions: {
          width: 15,
          height: 12,
          unit: 'meters',
        },
        rooms: [
          {
            id: 'living',
            name: 'Living Room',
            type: 'living',
            area: 35,
            coordinates: {
              x: 50,
              y: 50,
              width: 150,
              height: 100,
            },
          },
          {
            id: 'kitchen',
            name: 'Kitchen',
            type: 'kitchen',
            area: 25,
            coordinates: {
              x: 200,
              y: 50,
              width: 150,
              height: 100,
            },
          },
          {
            id: 'bedroom',
            name: 'Bedroom',
            type: 'bedroom',
            area: 20,
            coordinates: {
              x: 50,
              y: 150,
              width: 150,
              height: 100,
            },
          },
          {
            id: 'bathroom',
            name: 'Bathroom',
            type: 'bathroom',
            area: 10,
            coordinates: {
              x: 200,
              y: 150,
              width: 150,
              height: 100,
            },
          },
        ],
      },
      {
        id: 'first',
        name: 'First Floor',
        level: 1,
        imageUrl: '/images/floor-plans/first-floor.jpg',
        dimensions: {
          width: 15,
          height: 12,
          unit: 'meters',
        },
        rooms: [
          {
            id: 'master',
            name: 'Master Bedroom',
            type: 'bedroom',
            area: 30,
            coordinates: {
              x: 50,
              y: 50,
              width: 200,
              height: 150,
            },
          },
          {
            id: 'ensuite',
            name: 'En-suite Bathroom',
            type: 'bathroom',
            area: 15,
            coordinates: {
              x: 250,
              y: 50,
              width: 100,
              height: 100,
            },
          },
          {
            id: 'bedroom2',
            name: 'Bedroom 2',
            type: 'bedroom',
            area: 20,
            coordinates: {
              x: 50,
              y: 200,
              width: 150,
              height: 100,
            },
          },
        ],
      },
    ],
    scale: 100, // pixels per meter
    unit: 'meters',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }],
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const floorPlan = mockFloorPlans.get(params.id);
    
    if (!floorPlan) {
      return NextResponse.json(
        { error: 'Floor plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(floorPlan);
  } catch (error) {
    console.error('Error fetching floor plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch floor plan' },
      { status: 500 }
    );
  }
}
